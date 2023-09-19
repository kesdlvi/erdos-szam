
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './Graph.css';
import graphData from '../graphData.json';
import Path from './Path';
import Button from 'react-bootstrap/Button';
import 'font-awesome/css/font-awesome.min.css';






import { getColorForErdosNumber } from '../assets/functions/nodeColors';

const Graph = () => {

    const svgRef = useRef<SVGSVGElement | null>(null);
    // use states
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [selectedNode, setSelectedNode] = useState<Node | null >(null);
    const [dataFetched, setDataFetched] = useState(false)


    // searching states
    const [search, setSearch] = useState('');
    const [searchFrom, setSearchFrom] = useState('');
    const [searchTo, setSearchTo] = useState('');

    const [searchSuggestionsFrom, setSearchSuggestionsFrom] = useState<Node[]>([]);
    const [searchSuggestionsTo, setSearchSuggestionsTo] = useState<Node[]>([]);
    const [searchResults, setSearchResults] = useState<Node[]>([]);

    //Modal
    const [showModal, setShowModal] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState<Node[]>([]);

    const [isModalVisible, setModalVisible] = useState(false);

    // arrow button state
    const [arrowDirectionUp, setArrowDirectionUp] = useState(false);
    //svg full screen
    const [fullScreen, setFullScreen] = useState(false);

  
    const svg = d3.select(svgRef.current);


    // Define types for nodes and links. Add CoAuthor string to node
    type Node = { _id: string; name: string; x: number; y: number; description: string, ErdosNumber: number, CoAuthor: string};
    type Link = { source: string; target: string };

   
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearch(value);
  
      // Use your search algorithm here to find matching nodes
      const matchingNodes = nodes.filter((node) =>
        node.name.toLowerCase().includes(value.toLowerCase())
      );
  
      setSearchResults(matchingNodes);
    };

    const handleInputChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchFrom(value);
  
      // Use your search algorithm here to find matching nodes
      const matchingNodes = nodes.filter((node) =>
        node.name.toLowerCase().includes(value.toLowerCase())
      );
  
      setSearchSuggestionsFrom(matchingNodes);
    };

    const handleInputChangeTo = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchTo(value);
  
      // Use your search algorithm here to find matching nodes
      const matchingNodes = nodes.filter((node) =>
        node.name.toLowerCase().includes(value.toLowerCase())
      );
  
      setSearchSuggestionsTo(matchingNodes);
    };

    
  
    // Handle node selection from search results
    const handleNodeSelect = (selectedNode: Node) => {
      setSelectedNode(selectedNode);
      setSearch('');
  
      // Reset the color of previously selected nodes
      svg.selectAll('.node circle').attr('fill', (d : Node) =>
        getColorForErdosNumber(d.ErdosNumber)
      );
  
      // Highlight the selected node with yellow
      svg
        .selectAll('.node circle')
        .filter((d: Node) => d._id === selectedNode._id)
        .attr('fill', 'yellow');
    };

    // 
    const handleNodeSelectForFrom = (selectedNode: Node) => {
      setSearchFrom(selectedNode.name); // Fill the "Node From" input field
      setSearchSuggestionsFrom([])
    };
    
    const handleNodeSelectForTo = (selectedNode: Node) => {
      setSearchTo(selectedNode.name); // Fill the "Node To" input field
      setSearchSuggestionsTo([])
    };



    // search suggestion
    const renderSearchSuggestions = () => {
      if (search === '') {
        return null; // Don't render anything if the search bar is empty
      }
    
      return (
        <ul className='search-results'>
          {searchResults.map((node) => (
            <li
              key={node._id}
              onClick={() => handleNodeSelect(node)}
              className='search-result'
            >
              {node.name}
            </li>
          ))}
        </ul>
      );
    };


    const renderSearchSuggestionsFrom = () => {
      if (searchFrom === '') {
        return null;
      }
    
      return (
        <ul className='search-results-to-from'>
          {searchSuggestionsFrom.map((node) => (
            <li
              key={node._id}
              onClick={() => handleNodeSelectForFrom(node)}
              className='search-result'
            >
              {node.name}
            </li>
          ))}
        </ul>
      );
    };

    const renderSearchSuggestionsTo = () => {
      if (searchTo === '') {
        return null; 
      }
    
      return (
        <ul className='search-results-to-from'>
          {searchSuggestionsTo.map((node) => (
            <li
              key={node._id}
              onClick={() => handleNodeSelectForTo(node)}
              className='search-result'
            >
              {node.name}
            </li>
          ))}
        </ul>
      );
    };


    // Animation for button

    const handleButtonClick = () => {
      const animateButton = document.getElementById('animateButton');
      const horizontalLine = document.querySelector('.horizontal-line');
      
      if (animateButton && horizontalLine && searchFrom != "" && searchTo != "") {
        // Set a transition to move the button to the right
        animateButton.style.transition = 'left 1s linear';
        animateButton.style.left = '87%';
        
  
        // Add an event listener to reset the button after the animation
        animateButton.addEventListener('transitionend', () => {
          animateButton.style.transition = 'none';
          animateButton.style.left = '0';

          const sourceNode = nodes.find((node) => node.name === searchFrom);
          const targetNode = nodes.find((node) => node.name === searchTo);
          if (sourceNode && targetNode) {
            getPath(sourceNode, targetNode);
          }
          

          
          
        });
      } 
    };

    // Path algorithm

    const getPath = (source:Node, target:Node) => {
      let path = [];
      const targetPath = [];
      
      let currentSource = source; 
      while(currentSource.name !== "Paul Erdos") {
        if (currentSource.name == target.name) {
          path.push(currentSource);
          break;
        }
        path.push(currentSource);
        const coAuthorSourceName = currentSource.CoAuthor
        currentSource = nodes.find((node) => node.name === coAuthorSourceName)
      }
      if (!path.includes(target)) {
        path.push(nodes.find((node) => node.name === "Paul Erdos"))
      }
      
      
      let currentTarget = target;
      while (!path.includes(target) && currentTarget.name !== "Paul Erdos") {
        if (currentTarget.name == source.name) {
          path.length = 0; 
          targetPath.push(source);
          
          break; 
        }
        targetPath.push(currentTarget);
        const coAuthorTargetNode = currentTarget.CoAuthor;
        currentTarget = nodes.find((node) => node.name === coAuthorTargetNode)
      }

      path = path.concat(targetPath.reverse()); 
          
      setVisitedNodes(path); // Reverse the path to get the correct order
      setShowModal(true);
      openModal();
      console.log("visited names", visitedNodes);

    }
    

    const openModal = () => {
      setModalVisible(true);
      document.body.style.overflow = 'hidden'

  };

   const closeModal = () => {
      setShowModal(false);
      document.body.style.overflow = 'auto'
  };

  // SVG FULLSCREEN
  const toggleFullScreen = () => {
    if (fullScreen) {
      document.exitFullscreen();
    } else {
      const gfc = document.querySelector('.graph-function-container');
      if (gfc) {
        gfc.requestFullscreen();
      }
    }
    setFullScreen(!fullScreen);
  };


  // Arrow button up 
  const nodeArrowButtonUp = () => {
    const arrowDirection = document.querySelector('.arrow-up') as HTMLElement;
    const nodeConnectionContainer = document.querySelector('.node-connection-and-toggle-container ') as HTMLElement;

    if (nodeConnectionContainer) {
      const isHidden = nodeConnectionContainer.clientHeight === 43;
      nodeConnectionContainer.style.height = isHidden ? '200px' : '50px';
    } 
    if (arrowDirection) {
      arrowDirection.style.borderWidth = arrowDirectionUp ? '2px 0px 0px 2px' : '0px 2px 2px 0px'
      setArrowDirectionUp(!arrowDirectionUp);
    } 
  }

  const nodeLength = () => {
    if (nodes.length > 0) {
      return nodes.length
    }
  }
    
    // hook for fetching from db
    useEffect(() => {
      if (!svgRef.current) return;
  
      // Fetch nodes from db
      fetch('http://localhost:4000/api/commands')
        .then((response) => response.json())
        .then((data) => {
          setNodes(data);
          //console.log("nodes: ", nodes)
          fetch('http://localhost:4000/api/link')
            .then((response) => response.json())
            .then((data) => {
              setLinks(data);
              //console.log("Links: " , links)
              setDataFetched(true);
              
            })
            .catch((error) => {
              console.error("Error fetching link data", error);
            });
          
        })
        .catch((error) => {
          console.error('Error fetching node data:', error);
        });
  
      // Fetch links from db
     
    }, []);

  // hook for the node and links
    useEffect(() => {

        if (!dataFetched || nodes.length === 0 || links.length === 0) 
        {
          console.log("data not fetched")
          return;
        } 
        
        // else {
        //   console.log("working")
        //   console.log("Nodes: ", nodes)
        //   console.log("Links: ", links)
        //   nodes.forEach((node) => {
        //     //console.log(node._id);
        //   });
          
          
        // }
        // create a hashmap of node and id pairs
        const nodeMap = new Map(nodes.map((node) => [node._id, node]))!;
        
        const width = 1200;
        const height = 1200;

        const svg = d3.select(svgRef.current);

        const formattedLinks = links.map((link) => ({
          source: nodes.find((node) => node._id === link.source),
          target: nodes.find((node) => node._id === link.target),
        }));

        // forces on the nodes
        const simulation = d3
        .forceSimulation<Node>(nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(formattedLinks).id((d) => (d as Node)._id))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("random", d3.forceRadial(50, width / 2, height / 2))
        .force("collide", d3.forceCollide(50));
        // .force("x", d3.forceX(width * 0.5)) // Keep nodes within 50% of the container width
        // .force("y", d3.forceY(height / 2)); // Keep nodes within the vertical center

        const link = svg
        .selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", (d) => {
          const sourceNode = nodes.find((node) => node._id === d.source);
          
          //console.log(`Source Node for ${d.source}:`, sourceNode);
          //console.log(sourceNode ? sourceNode.x: 0)
          return sourceNode ? sourceNode.x : 0;
        })
        .attr("y1", (d) => {
          const sourceNode = nodes.find((node) => node._id === d.source);
          return sourceNode ? sourceNode.y : 0;
        })
        .attr("x2", (d) => {
          const targetNode = nodes.find((node) => node._id === d.target);
          //console.log(`Target Node for ${d.target}:`, targetNode);
          return targetNode ? targetNode.x : 0;
        })
        .attr("y2", (d) => {
          const targetNode = nodes.find((node) => node._id === d.target);
          return targetNode ? targetNode.y : 0;
        });

        //highlighing in link search
        
        
        
      const node = svg
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g") // Create a group for each node
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`) // Position the group based on node's x and y
        .on("click", (event, d) => {
          setSelectedNode(d); // chooses node to update description box
        });

      // assigns colors to node
      node.append("circle")
        .attr("r", 10)
        .attr("fill", (d) => getColorForErdosNumber(d.ErdosNumber));

      node.append("text") // Append a text element for node names
        .attr("dy", 20) // Adjust the dy value to control the distance from the node
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text((d) => d.name);

      node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

      simulation.on("tick", () => {
        link
        .attr("x1", (d) => {
          const sourceNode = nodeMap.get(d.source);
          return sourceNode ? sourceNode.x : 0; 
        })
        .attr("y1", (d) => {
          const sourceNode = nodeMap.get(d.source);
          return sourceNode ? sourceNode.y : 0; 
        })
        .attr("x2", (d) => {
          const targetNode = nodeMap.get(d.target);
          return targetNode ? targetNode.x : 0; 
        })
        .attr("y2", (d) => {
          const targetNode = nodeMap.get(d.target);
          return targetNode ? targetNode.y : 0; 
        })
        
        
        node
          .attr("transform", (d) => `translate(${d.x},${d.y})`); // Update node positions
      });
        
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
        
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
        
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    }, [dataFetched,nodes,links])

    
    


  return (
    <div className='flex-container'>
      

      {showModal && 
        <Path visitedNodes={visitedNodes} closeModal = {closeModal}/>
      }


    <div className=  'graph-function-container'>
      <div className='search-and-button-container'>
          {/* Search bar */}
        <div className='search-bar-container'>
          <input
            className='search-bar'
            type='text'
            placeholder='&#128269;   Search...'
            value={search}
            onChange={handleInputChange}
          />
          {/* Display auto-suggestions */}
          {renderSearchSuggestions()}
          
          
        </div>

        <div className='fullscreen-button-container'>
          {/* Fullscreen button */}
          <button className='fullscreen-button' onClick={toggleFullScreen}>
            ↗️
          </button>

        </div>
      </div>
      
        <svg 
        ref={svgRef} 
        className={fullScreen ? 'svg-container full-screen' : 'svg-container'} 
        viewBox={`0 0 1200 1200`}
        style={{ backgroundColor: fullScreen ? 'white' : 'transparent' }}
        >
          <g className={`content ${fullScreen ? 'full-screen' : ''}`}>
          {/* Place your nodes and links here */}
          {fullScreen && ( // Conditionally render the <rect> only in fullscreen
            <rect
              x="1500"
              y="20"
              width="40"
              height="40"
              fill="white"
              stroke="black"
              strokeWidth="2"
              rx="5"
              ry="5"
              cursor="pointer"
              onClick={toggleFullScreen}
            />
          )}
          </g>
        </svg>

        {/* Node connection  */}
        <div className='node-connection-and-toggle-container'>
          <div className='button-and-node-count-container'>
            <Button className = "arrow-button-up" onClick={nodeArrowButtonUp}>
              <a className='arrow-up'></a>
            </Button>
            <div className='node-count'>
              <span>{nodeLength()} 👤</span>
            </div>
          </div>
          
          
          <div className='node-connection-container'>
              <div className="button-containers">
                  <div className="left-input">
                    <input 
                    className="node-from" 
                    type="text" 
                    placeholder="From..." 
                    value={searchFrom}
                    onChange={handleInputChangeFrom}
                    />
                    {renderSearchSuggestionsFrom()}
                  </div>

                  <div className='button-line'>
                    <button 
                    id = 'animateButton'
                    className='animate-button' 
                    onClick={handleButtonClick}
                    >→</button>
                    <div className="horizontal-line"></div>
                  </div>
                  
              
                  <div className="right-input">
                    <input 
                    className="node-to" 
                    type="text"               
                    placeholder="To..."
                    value = {searchTo}
                    onChange={handleInputChangeTo}
                    />
                  {renderSearchSuggestionsTo()}
                  </div>
              </div>
            </div>
          </div>

    </div>

    <div className='character-container'>
        {/* Description container */}
        <div className='description-container'>
          <h1 className='description-text'>
            {selectedNode ? selectedNode.name : 'Erdős Szam'}
          </h1>
          <h2 className='description-text'>
            {selectedNode ? selectedNode.description : 'Click a node...'}
            {}
            {/* <span className='read-more-modal' onClick={console.log("update")}>  read more</span> */}
            
          </h2>
          
        </div>


      </div>
      
  </div>
  );
};



export default Graph;

