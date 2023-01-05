import React, { Component } from "react";
import { BASE_URL } from "../config/config";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./image-gallery.css";

export default class ImageGalleryItem extends Component {
    constructor(props) {
        super(props);
        this.getFullImage = this.getFullImage.bind(this);
        this.state = {
            image: null ,
            item: this.props.item
        }
    }

    componentDidMount() {
        this.getFullImage(this.state.item);
    }

    getFullImage = (item) => {
        if (item) {
            fetch(`${BASE_URL}/issue/getImage/${item.id}/${item.filename}`)
                .then((res) => res.text())
                .then((res) => {
                    this.setState({
                        image: res
                    })
                });
        }
    }

    render() {
        const {image} = this.state;
        if (image) {
            return(
                <div>
                    <img className='image-gallery-image'
                        src={image}
                        alt={""}
                    />
                </div>
            )
        } else {
            return (
                <div className='image-gallery-image'>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                        <CircularProgress />
                    </div>
                </div>
            );
        }
    }
}