
import { useState, useEffect } from 'react';
import './Request.css';

const Request = () => {
 

  // Inputs
  const [name, setName] = useState('');
  const [ErdosNumber, setErdosNumber] = useState(null);
  const [description, setDescription] = useState('');
  const [occupation, setOccupation] = useState('');
  const [error, setError] = useState(null);
  
  const [coAuthorSearchResults, setCoAuthorSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [currentNodesInDB, setCurrentNodesInDB] = useState([]);

   //checkbox input fields
   const [showLinkInput, setShowLinkInput] = useState(false);
   const [showNotableWorks, setShowNotableWorks] = useState(false);
   const [CoAuthor, setCoAuthor] = useState('');
   const [notableWorks, setNotableWorks] = useState('');
   const [showWebsite, setShowWebsite] = useState(false);
   const [website, setWebsite] = useState('');

  // link inputs
  const [source, setSource] = useState('')
  const [target,setTarget] = useState('');
  
  // parent node will always be the source (i.e the node being connected to)

  

  const handleShowLinkInput = () => {
    setShowLinkInput(!showLinkInput);
  };

  const handleShowNotableWorks = () => {
    setShowNotableWorks(!showNotableWorks);
  }

  const handleShowWebsite = () => {
    setShowWebsite(!showWebsite);
  }

  const nodeFetchAndAppend = () => {
    fetch('http://localhost:4000/api/commands')
      .then((response) => response.json())
      .then((data) => {
        setCoAuthorSearchResults(data);
        setCurrentNodesInDB(data);
        //console.log(currentNodesInDB)
        //console.log("Co Author search results", coAuthorSearchResults)
      })
      .catch((error) => {
        console.error('Error fetching node data:', error);
      });

  }



  // Fetch node data from the database
  useEffect(() => {
    nodeFetchAndAppend();
  }, [CoAuthor]);


  useEffect(() => {
    if (!CoAuthor) {
      // If CoAuthor is empty, clear the search results
      setCoAuthorSearchResults([]);
    }
  }, [CoAuthor]);



  // Function to get Co-Author suggestions based on input value
  const getCoAuthorSuggestions = (inputValue) => {
    if (!inputValue || !showLinkInput) {
        return [];
    } 
    const inputValueLowerCase = inputValue.toLowerCase();
    return coAuthorSearchResults .filter((node) => 
        node.name.toLowerCase().includes(inputValueLowerCase)
    );
      
  };

  // Node Creation

  const createNode = async (e) => {
    e.preventDefault();

    // JSON payload
    const jsonPayload = JSON.stringify({
      name,
      x: 800,
      y: 300,
      occupation,
      ErdosNumber,
      description,
      CoAuthor,
    });

    const response = await fetch('http://localhost:4000/api/commands', {
      method: 'POST',
      credentials: 'include',
      body: jsonPayload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      console.error('Error:', json.error);
    }
    if (response.ok) {
        setError(null);
        console.log('Node added', json);
        // link creation 
       
        setSource(CoAuthor)
        setTarget(name)
        
        console.log("Two nodes Name", source, target)
        setName('');
        setDescription('');
        setErdosNumber(null);
        setOccupation('');
        setCoAuthor('');         
    }
  };


  

  // link creation 

  useEffect(() => {
    const linkCreation =async () => {
        try {
            const uploadTime = 2000;
            await new Promise(res => setTimeout(res, uploadTime))
            const recentNodeId = await getNodeByName(currentNodesInDB, target);
            const recentCoAuthorId = await getNodeByName(currentNodesInDB, source);
            console.log("Two nodes id", recentNodeId._id, recentCoAuthorId._id)
            
            // add prompted creation state to prevent premature creation
            if (recentNodeId && recentCoAuthorId) {
                console.log("created Link");
                createLink(recentCoAuthorId._id, recentNodeId._id);
                setSource('');
                setTarget('');
                
            } else {
                console.log("still not working")
            }

        } catch (error) {
            console.error("Error in nodeFetchandAppend", error)
            console.log("thing")
        }
        
    }
    linkCreation(); 
  }, [currentNodesInDB])

  const createLink = async (sourceNodeId:string, targetNodeId:string) => {

    const jsonLink = JSON.stringify({

    
        source: sourceNodeId,
        target: targetNodeId,
    });

    const response = await fetch('http://localhost:4000/api/link', {
        method: 'POST',
        credentials: 'include',
        body: jsonLink,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    const json = await response.json();

    if (!response.ok) {
        setError(json.error);
        console.error('Error:', json.error);
        console.log("error in link creation")
      }
      if (response.ok) {
        setError(null);
        console.log('Link added', json);
        
      }
  }

    const getNodeByName = (nodes, coAuthorName:string) => {
        console.log("The current nodes", currentNodesInDB, " The node you want to look for", coAuthorName)
        return nodes.find((node) => node.name.toLowerCase() === coAuthorName.toLowerCase());
      }

    // const confirmNodeInDB = (newNode:string) => {
    //     return
         
    // }



  return (
    <div>
      <div className='request-top'>
        <a href="/">🏠</a>
        
        
      </div>

      <form className="request-container" onSubmit={createNode}>
        <div className="node-header">
          <h1>Who should we add?</h1>
        </div>

        <div className="node-link-container">
          <div className="node-information">
            <div className="form-title">Author Info</div>

            <input
              className="node-input"
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              className="node-input"
              type="text"
              placeholder="Occupation"
              onChange={(e) => setOccupation(e.target.value)}
              value={occupation}
            />
            <input
              className="node-input"
              type="number"
              placeholder="Their Erdos Number"
              onChange={(e) => setErdosNumber(Math.max(1, parseInt(e.target.value, 10)))}
              value={ErdosNumber}
              min = '1'
            />
            <textarea
              rows={4}
              className="no-resize"
              placeholder="Enter a description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
          </div>

          <div className="link-information">
            <div className="link-input">
              <button
                type="button"
                className={showLinkInput ? 'checked' : ''}
                onClick={handleShowLinkInput}
              >
                {showLinkInput && <span>&#x2713;</span>}
              </button>
              <h2>Collaborator?</h2>
              
            </div>

            {showLinkInput && (
              <div className='coauthor-input'>
                
                <input
                  className='node-input'
                  type="text"
                  placeholder="CoAuthor"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setCoAuthor(inputValue);
                    const suggestions = getCoAuthorSuggestions(inputValue);
                    setCoAuthorSearchResults(suggestions);
                    setFilteredResults(suggestions)
                    
                  }}
                  value={CoAuthor}
                />
                {CoAuthor && filteredResults.length > 0 && (
                  <ul className="search-results">
                    {filteredResults.map((suggestion) => (
                      <li
                        key={suggestion._id}
                        onClick={() => {
                          setCoAuthor(suggestion.name);
                          setCoAuthorSearchResults([]);
                        }}
                        className="search-result"
                      >
                        {suggestion.name}
                        
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <div className="link-input">
              <button
                type="button"
                className={showNotableWorks ? 'checked' : ''}
                onClick={handleShowNotableWorks} // create another state for papers
              >
                {showNotableWorks && <span>&#x2713;</span>}
              </button>
              <h2>Notable Works?</h2>
              
            </div>
            {showNotableWorks && ( 
              <div className='notable-works-input'>
                  <input
                  className='node-input'
                  type="text"
                  placeholder="Link to work"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setNotableWorks(inputValue)
                  }}
                  value={notableWorks}
                />
              </div>
            )}

            <div className="link-input">
              <button
                type="button"
                className={showWebsite ? 'checked' : ''}
                onClick={handleShowWebsite} // create another state for papers
              >
                {showWebsite && <span>&#x2713;</span>}
              </button>
              <h2>Website?</h2>
              
            </div>
            {showWebsite && (
              <div className='website-input'>
              <input
              className='node-input'
              type="text"
              placeholder="Website Link"
              onChange={(e) => {
                const inputValue = e.target.value;
                setWebsite(inputValue)
              }}
              value={website}
            />
          </div>
            )}

          </div>
        </div>

        <button className= "submit-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Request;
