import React from 'react';

const Biography = ({imageUrl}) => {
    return (
        <div className='container biography'>
            <div className='banner'>
                <img src={imageUrl} alt='about'/>
            </div>
            <div className='banner'>
                <p>Biography</p>
                <h3>Who we are</h3>
                <p>Est adipisicing dolor minim ad anim. Sit amet eu culpa eu aliquip ea. 
                    Laborum duis dolore aute non consectetur culpa culpa exercitation consequat consequat. 
                    Excepteur ipsum id sunt ipsum nisi sit.
                </p>
                <p>Laborum duis dolore exercitation consequat consequat.</p>
                <p>Aute non consectetur culpa</p>
                <p>Laborum duis dolore aute non consectetur culpa Sit amet eu culpa eu aliquip ea. 
                    Laborum duis dolore aute non consectetur culpa culpa exercitation consequat consequat. 
                    Excepteur ipsum id sunt ipsum nisi sit.
                </p>
                <p>Laborum</p>
            </div>            
        </div>
    );
}

export default Biography;
