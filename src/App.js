import React, { Component } from "react";
import "./App.css";
import Clarifai from "clarifai";
import Navigation from "../src/Components/navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Particles from "react-particles-js";
import SignIn from "./Components/Signin/Signin";
import Register from "./Components/Signup/Signup";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";

const app = new Clarifai.App({
  apiKey: "3b756f2cbc45437188c5c3abe0dfd813",
});

const particleOptions = {
  particles: {
    number: {
      vlaue: 150,
      density: {
        enable: true,
        value_area: 1000,
      },
    },
    size: {
      value: 5,
      random: true,
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false,
        },
      },
      modes: {
        push: {
          particles_nb: 12,
        },
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
    };
  }

  // componentDidMount() {
  //   fetch("http://localhost:5000")
  //     .then((response) => response.json())
  //     .then(console.log);
  // }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onSubmit = () => {
    // console.log("click");
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => {
        // console.log("hi", response);
        // if (response) {
        //   fetch('http://localhost:3000/image', {
        //     method: 'put',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({
        //       id: this.state.user.id
        //     })
        //   })
        //     .then(response => response.json())
        //     .then(count => {
        //       this.setState(Object.assign(this.state.user, { entries: count}))
        //     })

        // }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }

    this.setState({ route: route });
  };
  render() {
    const { isSignedIn, route, imageUrl, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
