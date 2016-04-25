import d3 from 'd3'
var $window
  , $parse
  , path
  , force
  , circle
  , colors
  , drag_line
  , selected_node = null
  , selected_link = null
  , mousedown_link = null
  , mousedown_node = null
  , mouseup_node = null
  , lastKeyDown = -1;

export default class D3Directive {
  constructor($w, $p) {
    this.restrict = 'E';
    this.scope = {
      nodes: "=nodes",
      addNode: '&',
      removeNode: '&',
      addLink: '&',
      removeLink: '&',
      updateSelectNode: '&',
      updateSelectLink: '&'
    };
    $window = $w;
    $parse = $p;
    colors = d3.scale.category10();
  }

  static resetMouseVars() {
    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
  };


  static getLinks(nodes) {
    let getNode = (id) => nodes.filter(x => x.id == id)[0];

    return nodes.reduce((result, nodo) => {
      nodo.neighbors.map((n) => {
        let nodoNeig = getNode(n.id);

        result.push({
          source: nodo,
          target: nodoNeig,
          left: nodoNeig.neighbors.some(x => x.id == nodo.id),
          right: true
        });
      });

      return result;
    }, []);
  }

  static tick() {
    // draw directed edges with proper padding from node centers
    path.attr('d', function(d) {
      var deltaX = d.target.x - d.source.x,
          deltaY = d.target.y - d.source.y,
          dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
          normX = deltaX / dist,
          normY = deltaY / dist,
          sourcePadding = d.left ? 17 : 12,
          targetPadding = d.right ? 17 : 12,
          sourceX = d.source.x + (sourcePadding * normX),
          sourceY = d.source.y + (sourcePadding * normY),
          targetX = d.target.x - (targetPadding * normX),
          targetY = d.target.y - (targetPadding * normY);
      return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    });

    circle.attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });
  }

  static restart(scope, nodes, links) {
    path = path.data(links);

    // update existing links
    path.classed('selected', (d) =>  d === selected_link)
      .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');

    // add new links
    path.enter().append('svg:path')
      .attr('class', 'link')
      .classed('selected', (d) => d === selected_link)
      .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '')
      .on('mousedown', (d) => {
        if(d3.event.ctrlKey) return;
        // select link
        mousedown_link = d;
        selected_node = null;

        if (mousedown_link === selected_link)  {
          selected_link = null;
        } else {
          selected_link = mousedown_link;
        }

        scope.$apply(function(){
            scope.updateSelectLink({ link: selected_link });
            scope.updateSelectNode({ node: selected_node });
        });
        D3Directive.restart(scope, nodes, links);
      });

    // remove old links
    path.exit().remove();

    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    circle = circle.data(nodes, function(d) { return d.id; });
    console.log(circle);

    // update existing nodes (reflexive & selected visual states)
    circle.selectAll('circle')
      .style('fill', (d) => (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))

    // add new nodes
    var g = circle.enter().append('svg:g');

    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', 12)
      .style('fill', (d) => (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
      .style('stroke', (d) => d3.rgb(colors(d.id)).darker().toString())
      .on('mouseover', function(d) {
        if(!mousedown_node || d === mousedown_node) return;
        // enlarge target node
        d3.select(this).attr('transform', 'scale(1.1)');
      })
      .on('mouseout', function(d) {
        if(!self.mousedown_node || d === self.mousedown_node) return;
        // unenlarge target node
        d3.select(this).attr('transform', '');
      })
      .on('mousedown', function(d) {
        if(d3.event.ctrlKey) return;

        // select node
        mousedown_node = d;
        selected_link = null;
        if (mousedown_node === selected_node) {
          selected_node = null;
        } else {
          selected_node = mousedown_node;
        }
        scope.$apply(function(){
            scope.updateSelectNode({ node: selected_node });
            scope.updateSelectLink({ link: selected_link });
        });

        // reposition drag line
        drag_line
          .style('marker-end', 'url(#end-arrow)')
          .classed('hidden', false)
          .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

        D3Directive.restart(scope, nodes, links);
      })
      .on('mouseup', function(d) {
        if(!mousedown_node) return;

        // needed by FF
        drag_line
          .classed('hidden', true)
          .style('marker-end', '');

        // check for drag-to-self
        mouseup_node = d;
        if(mouseup_node === mousedown_node) {
          D3Directive.resetMouseVars();
          return;
        }

        // unenlarge target node
        d3.select(this).attr('transform', '');

        // add link to graph (update if exists)
        // NB: links are strictly source < target; arrows separately specified by booleans
        var source, target, direction;
        if(mousedown_node.id < mouseup_node.id) {
          source = mousedown_node;
          target = mouseup_node;
          direction = 'right';
        } else {
          source = mouseup_node;
          target = mousedown_node;
          direction = 'left';
        }

        var link = links.filter((l) => l.source === source && l.target === target)[0];

        if(link) {
          link[direction] = true;
        } else {
          link = {source: source, target: target, left: false, right: false};
          link[direction] = true;
        }
        // select new link
        selected_link = link;
        selected_node = null;

        scope.$apply(function(){
            scope.addLink({ source: source, target: target });
        });
      });

    // show node IDs
    g.append('svg:text')
        .attr('x', 0)
        .attr('y', 4)
        .attr('class', 'id')
        .text(function(d) { return d.id; });

    // remove old nodes
    circle.exit().remove();

    // set the graph in motion
    force.start();
  }

  link(scope, element, attrs) {
    var ele = element[0]
    var invoker = $parse(attrs.ctrlFn);


    var svg = d3.select(ele)
      .append('svg')
      .attr('oncontextmenu', 'return false;')
      .attr('width', 400)
      .attr('height', 400);

    var margin = parseInt(attrs.margin) || 20,
      barHeight = parseInt(attrs.barHeight) || 20,
      barPadding = parseInt(attrs.barPadding) || 5;

    // Browser onresize event
    window.onresize = function() {
      scope.$apply();
    };

    var nodes = scope.nodes
      , links = D3Directive.getLinks(nodes);

    // Watch for resize event
    scope.$watch(function() {
      return angular.element($window)[0].innerWidth;
    }, function() {
      scope.render(scope.data);
    });
    scope.$watchCollection('nodes', (newVal, oldVal) => {
      // console.log('scope.$watch');
      nodes = scope.nodes;
      links = D3Directive.getLinks(nodes);
      D3Directive.restart(scope, nodes, links)
    });

    for (let i in nodes) {
      scope.$watchCollection('nodes[' + i + '].neighbors', (newVal, oldVal) => {
        // console.log('scope.$watch.neighbors', newVal, oldVal);
        nodes = scope.nodes;
        links = D3Directive.getLinks(nodes);

        D3Directive.restart(scope, nodes, links)
      });
    }

    // scope.$watch('nodes.length', () => {
    //   console.log('scope.$watch.length');
    // });

    scope.render = function(data) {
      // remove all previous items before render
      svg.selectAll('*').remove();

      // If we don't pass any data, return out of the element
      if (!nodes) return;

      path = svg.append('svg:g').selectAll('path');
      circle = svg.append('svg:g').selectAll('g');
      drag_line = svg.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');

      force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([400, 400])
        .linkDistance(150)
        .charge(-500)
         .on('tick', D3Directive.tick);

      svg.append('svg:defs').append('svg:marker')
          .attr('id', 'end-arrow')
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 6)
          .attr('markerWidth', 3)
          .attr('markerHeight', 3)
          .attr('orient', 'auto')
          .append('svg:path')
          .attr('d', 'M0,-5L10,0L0,5')
          .attr('fill', '#000');

      svg.append('svg:defs').append('svg:marker')
          .attr('id', 'start-arrow')
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 4)
          .attr('markerWidth', 3)
          .attr('markerHeight', 3)
          .attr('orient', 'auto')
          .append('svg:path')
          .attr('d', 'M10,-5L0,0L10,5')
          .attr('fill', '#000');

      svg.on('mousedown', function() {
        // because :active only works in WebKit?
        svg.classed('active', true);

        if(d3.event.ctrlKey || mousedown_node || mousedown_link) return;

        scope.$apply(function(){
            scope.addNode();
        });
      })
      .on('mousemove', function() {
        if(!mousedown_node) return;

        // update drag line
        drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

        D3Directive.restart(scope, nodes, links);
      })
      .on('mouseup', function() {
        if(mousedown_node) {
          // hide drag line
          drag_line
            .classed('hidden', true)
            .style('marker-end', '');
        }

        // because :active only works in WebKit?
        svg.classed('active', false);
        D3Directive.resetMouseVars();
      });

      let spliceLinksForNode = (node) => {
        var toSplice = links.filter(function(l) {
          return (l.source === node || l.target === node);
        });
        toSplice.map(function(l) {
          links.splice(links.indexOf(l), 1);
        });
      };

      d3.select(window)
        .on('keydown', () => {
          let keys = [46, 66, 76, 82];
          if (keys.indexOf(d3.event.keyCode) !== -1) d3.event.preventDefault();

          if(lastKeyDown !== -1) return;
          lastKeyDown = d3.event.keyCode;

          // ctrl
          if(d3.event.keyCode === 17) {
            circle.call(force.drag);
            this.svg.classed('ctrl', true);
          }

          if(!selected_node && !selected_link) return;
          switch(d3.event.keyCode) {
            case 8: // backspace
            case 46: // delete
              if(selected_node) {
                scope.$apply(function(){
                    scope.removeNode({ node: selected_node });
                });
              } else if(selected_link) {
                scope.$apply(function(){
                    scope.removeLink({ link: selected_link });
                });
              }
              selected_link = null;
              selected_node = null;
              // this.restart();
              break;
            case 66: // B
              if(selected_link) {
                // set link direction to both left and right
                selected_link.left = true;
                selected_link.right = true;
              }
              D3Directive.restart(scope, nodes, links);
              break;
            case 76: // L
              if(selected_link) {
                // set link direction to left only
                selected_link.left = true;
                selected_link.right = false;
              }
              D3Directive.restart(scope, nodes, links);
              break;
            case 82: // R
              if(selected_node) {
                // toggle node reflexivity
                //selected_node.reflexive = !selected_node.reflexive;
              } else if(selected_link) {
                // set link direction to right only
                selected_link.left = false;
                selected_link.right = true;
              }
              D3Directive.restart(scope, nodes, links);
              break;
          }
        })
        .on('keyup', () => {
          lastKeyDown = -1;

          // ctrl
          if(d3.event.keyCode === 17) {
            circle
              .on('mousedown.drag', null)
              .on('touchstart.drag', null);
            svg.classed('ctrl', false);
          }
        });

      // svg.on('mousedown', () => { scope.ctrlFn({}); })
      /*angular.element(ele).on('mousedown', () => {
         scope.ctrlFn({});
         console.log('mousedown');
      });*/
      D3Directive.restart(scope, nodes, links);
    }
  }
}
