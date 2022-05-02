import React, { Component } from "react";

interface ImageSliderProps {
  images: Array<string>;
}

interface ImageSliderState {
  index: number;
}

class ImageSlider extends Component<ImageSliderProps, ImageSliderState> {
  constructor(props: ImageSliderProps) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  render() {
    return (
      <div className="img">
        <img
          className="item-image"
          src={this.props.images[this.state.index]}
          alt=""
        />
        <div className="slider">
          <i
            className="fa fa-angle-left fa-2x"
            onClick={() => {
              if (this.state.index === 0) return;
              this.setState({ ...this.state, index: this.state.index - 1 });
            }}
          ></i>
          <i
            className="fa fa-angle-right fa-2x"
            onClick={() => {
              if (this.state.index === this.props.images.length - 1) return;
              this.setState({ ...this.state, index: this.state.index + 1 });
            }}
          ></i>
        </div>
      </div>
    );
  }
}

export default ImageSlider;
