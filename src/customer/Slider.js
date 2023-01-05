import React from "react";
import { BASE_URL } from "../config/config";
import { NO_IMAGES } from "../language/nl";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import "./image-gallery.css";
import ImageGallery from "react-image-gallery";
import ImageGalleryItem from "./ImageGalleryItem";
import ImageGalleryThumb from './ImageGalleryThumb';

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.images,
      imagesbase64: [],
      imagesnormal: [],
      galleryImages: [],
      currentIndex: 0,
      translateValue: 0,
      full: false,
    };
    this.getItems = this.getItems.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderThumb = this.renderThumb.bind(this);
  }

  componentDidMount() {
    if (this.props.images) {
      if (this.props.images.length > 0) {
        this.getItems(this.props.images);
        // this.getImages(this.props.images);
      }
    }
  }

  getItems = (images) => {
    if (images.length > 0) {
      this.setState({
        galleryImages: images,
      });
    }    
  }


  goToPrevSlide = () =>
    this.state.currentIndex !== 0 &&
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex - 1,
      translateValue: prevState.translateValue + this.slideWidth(),
    }));

  goToNextSlide = () =>
    this.state.currentIndex !== this.state.images.length - 1 &&
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex + 1,
      translateValue: prevState.translateValue + -this.slideWidth(),
    }));

  full = () =>{
  
    this.setState((prevState) => ({
      full: !prevState.full,
      currentIndex: 0,
      translateValue: 0,
    }));
  }

  slideWidth = () => document.querySelector(".slide").clientWidth;

  renderItem(item) {
    return (<ImageGalleryItem item={item}/>)
  }

  renderThumb(item) {
    return (<ImageGalleryThumb item={item}/>)
  }

  render() {
    if (!this.props.images) {
      return (
        <Container maxWidth="xl" align="center">
          <CircularProgress />
        </Container>
      );
    }
    // if (this.state.imagesbase64.length < 1 && this.props.images.length > 0)
    //   return (
    //     <Container maxWidth="xl" align="center">
    //       <CircularProgress />
    //     </Container>
    //   );
    return (
      <React.Fragment>
        {this.state.galleryImages.length < 1 ? (
          <p>{NO_IMAGES}</p>
        ) : (
          
            <>
           
          <ImageGallery
            items={this.state.galleryImages}
            showNav={true}
            showThumbnails={true}
            showBullets={true}
            useBrowserFullscreen={false}
            lazyLoad={true}
            renderFullscreenButton={(onClick, isFullscreen) => {
              return (
                <div
                  className={
                    isFullscreen ? "full-screen active" : "full-screen"
                  }
                  onClick={onClick}
                >
                  <img
                    src={isFullscreen ? "/close.png" : "/ZoomIn_Icon.png"}
                    alt="right-arrow"
                  />
                </div>
              );
            }}
            renderRightNav={(onClick, disabled) => (
              <div
                className={
                  "arrow-button right" + (disabled ? " disabled" : "")
                }
                onClick={disabled ? () => {} : onClick}
              >
                <img src={"/arrow-right.png"} alt="right-arrow" />
              </div>
            )}
            renderLeftNav={(onClick, disabled) => (
              <div
                className={
                  "arrow-button left" + (disabled ? " disabled" : "")
                }
                onClick={disabled ? () => {} : onClick}
              >
                <img src={"/arrow-left.png"} alt="left-arrow" />
              </div>
            )}
            renderItem={this.renderItem}
            renderThumbInner={this.renderThumb}
          />
          </>
        )}
      </React.Fragment>
    );
  }
}
