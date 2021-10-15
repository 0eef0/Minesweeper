import React, {useState} from 'react'

const Square = ({number, dead, die, checkFlagging, flags, setFlag, safe, setSafe, score, setScore, bombs, boardSize, checkWin}) => {
    const [hidden, setHidden] = useState(true);
    const [flagged, setFlagged] = useState(false);

    const handleClick = () => {
        if(checkFlagging()){
            setFlagged(!flagged);
            (flagged) ? setFlag(flags - 1) : setFlag(flags + 1);
        }else if(!flagged){
            setHidden(false);
            if(number < 0){
                die();
            }else if(hidden){
                setSafe(safe - 1);
                setScore((score + Math.floor(1000 * (bombs / (boardSize ** 2)))));
                checkWin();
            }
        }
    }

    return (
        <div className={(hidden && !dead) ? (flagged) ? 'hidden flagged square' : 'hidden square' : (!flagged) ? 'square' : (!dead) ? 'hidden flagged square' : 'square'} onClick={() => {handleClick()}} style={{width: `${30/boardSize}vw`, height: `${30/boardSize}vw`}}>
            <p className={`number${number}`} style={{fontSize: `${20/boardSize}vw`, width: `${30/boardSize}vw`}}>{(number >= 0) ? number : '*'}</p>
        </div>
    )
}

export default Square
