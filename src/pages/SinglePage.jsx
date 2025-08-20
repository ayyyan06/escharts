import React from "react";
import '../style.css'
import { useParams } from "react-router-dom";

export const SinglePage = () => {
    const {id} = useParams()
    return(
        <div className="home">
            <h1>Post number {id}</h1>
            <p>This is Home page</p>
        </div>
    )
}