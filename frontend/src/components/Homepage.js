import React from 'react';


const Homepage = () => {
    document.body.style.backgroundColor = '#767676';


    return (
        <div>
            <div style={{backgroundColor: "white", borderRadius: 20, paddingBottom: 50, width: 500, margin: "auto"}}>
            <h1 style={{fontSize: 400, textAlign: "center",marginTop: -100}}>⌂</h1>
                <h1 style={{textAlign: "center", marginTop: -50}}>HOMEPAGE</h1>
                <h3 style={{textAlign: "center"}}>Witaj na stronie głównej aplikacji!</h3>
            </div>
        </div>
    );
};

export default Homepage;