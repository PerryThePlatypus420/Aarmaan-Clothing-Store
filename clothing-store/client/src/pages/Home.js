import React from "react";
import Cover from '../components/Cover';
import Categories from '../components/Categories';
import SummerCollection from '../components/SummerCollection';


function Home() {


    return (
        <>
            <Cover />
            
            <h1 style={{ marginTop: "30px" }}>Categories</h1>

            <Categories />
            <SummerCollection />
        </>
    );
}

export default Home;