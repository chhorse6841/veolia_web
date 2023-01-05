import React, { Component } from "react";
import { BASE_URL } from "../config/config";
import "./image-gallery.css";

export default class ImageGalleryThumb extends Component {
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
            fetch(`${BASE_URL}/issue/getThumbnail/${item.id}/${item.filename}`)
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
        return(
            <div className='image-gallery-thumbnail-inner'>
                <img className='image-gallery-thumbnail-image'
                    src={image}
                    alt={""}
                />
            </div>
        )
    }
}