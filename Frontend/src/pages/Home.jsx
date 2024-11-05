import React from 'react';
import Hero from "../components/Hero";
import Biography from "../components/Biography";
import Department from "../components/Departments";
import Message from "../components/Message";

const Home = () => {
    return (
        <>
          <Hero title={"Welcome to Care Connect"} imageUrl={"/hero.png"}/>
          <Biography imageUrl={"/about.png"}/>
          <Department/>
          <Message/>  
        </>
    );
}

export default Home;
