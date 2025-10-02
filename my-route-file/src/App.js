import React  from "react";
import { BrowserRouter as Router,Routes,Route  } from "react-router-dom";
import { Link } from "react-router-dom";


 const Home = () => <h2>Home</h2>;
 const About = () => <h2>About</h2>;
 const Users = () => <h2>Users</h2>;







function App() {
  return (
    <div >
    <Router>
  <nav>
    <ul>
      <li><Link to = "/"> Home</Link></li>
      <li><Link to = "/about"> About</Link></li>
      <li><Link to = "/users"> Users</Link></li>  
    </ul>


  </nav>
 <Routes>
 <Route path="/" element={<Home />} />
 <Route path="/about" element={<About />} />
 <Route path="/users" element={<Users />} />
    
  </Routes>


    </Router>


    
    </div>
  );
}

export default App;
