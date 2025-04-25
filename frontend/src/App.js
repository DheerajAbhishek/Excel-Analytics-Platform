import logo from './logo.svg';
import './styles.css';
import Nav from './Nav';

function App() {
  return (
    <div className="App">
      <Nav />
      <div className="container">
        <div className="form-container">
          {/* Sign Up Form */}
          <form id="signup-form" action={"http://localhost:5000/signup"} method="POST">
            <h2>Sign Up</h2>
            <input type="text" name="username" id="signup-username" placeholder="Username" required />
            <input type="email" name="email" id="signup-email" placeholder="Email" required />
            <input type="password" name="password" id="signup-password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
          </form>

          {/* Login Form */}
          <form id="login-form">
            <h2>Login</h2>
            <input type="email" id="login-email" placeholder="Email" required />
            <input type="password" id="login-password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
