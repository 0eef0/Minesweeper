import React, {useEffect, useState } from 'react';
import Square from './Components/Square';
import { AiOutlineNumber, AiFillFlag } from 'react-icons/ai';
import { RiNumber1, RiNumber2, RiNumber3 } from 'react-icons/ri';
import { IconContext } from 'react-icons/lib';
import config from './Utils/config';
const axios = require('axios').default;

const App = () => {
    const [flagging, setFlagging] = useState(false);
    const [dead, setDead] = useState(false);
    const [boardSize, setBoardSize] = useState(10);
    const [bombs, setBombs] = useState(20);
    const [safe, setSafe] = useState(boardSize ** 2 - bombs)
    const [flags, setFlags] = useState(0);
    const [game, setGame] = useState([]);
    const [hiScore, setHiScore] = useState(
        [
            'Error:,404',
            'Cannot,404',
            'Access,404',
            'Scores,404',
            'Unfortunately.,404',
            'Will,404',
            'Eventually,404',
            'Come,404',
            'Back,404',
            ':D,404'
        ]
    );
    const [user, setUser] = useState('');
    const [score, setScore] = useState(0);
    const [landscape, setLandscape] = useState(window.innerWidth < window.innerHeight);
    useEffect(() => {
        window.addEventListener('orientationchange', () => {(window.innerWidth < window.innerHeight) ? setLandscape(false) : setLandscape(true)})
    },[])
    
    const getScore = async () => {
        var options = {
            method: "POST",
            url: "https://google-sheets-toolbox.p.rapidapi.com/",
            headers: {
                'content-type': 'application/json',
                'x-rapidapi-host': 'google-sheets-toolbox.p.rapidapi.com',
                'x-rapidapi-key': config.rapidKey,
            },
            data: {
                action: 'get google sheet as array',
                options: {
                    fromRowIndex: '2',
                    googleSheetId: '1HeflJXt7ZDGf9vtnKF9WLuQ11vKP0YcRcvoR5EFAfAA',
                    googleSheetTabTitle: 'Scoreboard',
                    googlePrivateKey: config.googlePrivateKey,
                    googleClientEmail: "minesweeper-scoreboard-editor@unified-ruler-328021.iam.gserviceaccount.com",
                    toRowIndex: '100'
                }
            }
        }
        axios.request(options)
        .then((res) => {
            let arr = res.data.data;

            arr.shift();
            setHiScore(arr);
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const uploadScore = () => {
        var options = {
            method: 'POST',
            url: 'https://google-sheets-toolbox.p.rapidapi.com/',
            headers: {
                'content-type': 'application/json',
                'x-rapidapi-host': 'google-sheets-toolbox.p.rapidapi.com',
                'x-rapidapi-key': config.rapidKey,
            },
            data: {
                action: 'add rows',
                options: {
                    addNewRows: [
                        [user, score], 
                    ],
                    googleClientEmail: 'minesweeper-scoreboard-editor@unified-ruler-328021.iam.gserviceaccount.com',
                    googlePrivateKey: config.googlePrivateKey,
                    googleSheetId: '1HeflJXt7ZDGf9vtnKF9WLuQ11vKP0YcRcvoR5EFAfAA',
                    googleSheetTabTitle: 'Scoreboard'
                }
            }
        };

        axios.request(options).then(function (response) {
            //console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }

    const getBoard = async (size, bomb) => {
        var options = {
            method: 'GET',
            url: 'https://minesweeper1.p.rapidapi.com/boards/new',
            params: {
                r: size,
                c: size,
                bombs: bomb
            },
            headers: {
                'x-rapidapi-host': 'minesweeper1.p.rapidapi.com',
                'x-rapidapi-key': config.rapidKey,
            }
        };
        
        const res = await axios.request(options);
        setGame(res.data.board);
        setSafe(size ** 2 - bomb);
    }

    useEffect(() => {
        getScore()
        .catch((err) => {
            console.log(err)
        })
    }, [boardSize, bombs])

    const reset = () => {
        setScore(0);
        setUser('');
        let squares = document.getElementsByClassName('square');
        for (let i = 0; i < squares.length; i++) {
            squares[i].classList.add('hidden');
        }
        getBoard(boardSize, bombs);
    }

    const die = () => {
        uploadScore();
        setDead(true);
    }

    const checkFlagging = () => {
        return flagging;
    }

    const assembleBoard = () => {
        let board = [];
        for (let row = 0; row < game.length; row++) {
            for(let square = 0; square < game[row].length; square++){
                board.push(<Square key={`${row},${square}`} number={game[row][square]} dead={dead} die={die} checkFlagging={checkFlagging} flags={flags} setFlag={setFlags} safe={safe} setSafe={setSafe} score={score} setScore={setScore} bombs={bombs} boardSize={boardSize} checkWin={checkWin} />) //`
            }
        }
        return board;
    }

    const getRank = (rank) => {
        switch(rank) {
            case 0:
                return <IconContext.Provider value={{className: 'rankIcons1'}}><AiOutlineNumber /><RiNumber1 /></IconContext.Provider>
            case 1:
                return <IconContext.Provider value={{className: 'rankIcons2'}}><AiOutlineNumber /><RiNumber2 /></IconContext.Provider>
            case 2:
                return <IconContext.Provider value={{className: 'rankIcons3'}}><AiOutlineNumber /><RiNumber3 /></IconContext.Provider>
            default:
                return <><AiOutlineNumber size={10} />{rank+1}</>
        }
    }

    const assembleScoreboard = () => {
        let arr = [];
        let tempArr = [];
        hiScore.map((score) => {
            tempArr.push(score.split(','));
            return '';
        });
        tempArr = tempArr.sort((a,b) => {
            return b[1] - a[1];
        })

        for(let i = 0; i < 10; i++){
            if(tempArr[i]){
                let temp = tempArr[i];
                arr.push(
                    <tr key={`row${i}`}>
                        <td key={`rank${i}`} style={{textAlign: 'center'}}>{getRank(i)}</td>
                        <td key={`name${i}`} style={(i === 0) ? {fontSize: 'calc(1.25vh + 1.25vw)'} : (i === 1) ? {fontSize: 'calc(1vh + 1vw)'} : {}}>{`${temp[0]}`}</td>
                        <td key={`score${i}`} style={(i === 0) ? {fontSize: 'calc(1.25vh + 1.25vw)',textAlign: 'center'} : (i === 1) ? {fontSize: 'calc(1vh + 1vw)',textAlign: 'center'} : {textAlign: 'center'}}>{temp[1]}</td>
                    </tr>
                )
            }
        }

        return arr;
    }

    const checkWin = () => {
        if(safe === 0){
            uploadScore();
            getScore();
        }
    }

    const setup = () => {
        const user = document.getElementById('user').value;
        const size = Number(document.getElementById('size').value);
        const bomb = Number(document.getElementById('bomb').value);
        const ratio = Math.floor((bomb / 100) * (size ** 2));
        setBoardSize(size);
        setBombs(ratio);
        setUser(user);
        getBoard(size, ratio);
    }

    if(user === ''){
        return(
            <div id='setup'>
                <h1><span>*</span>Minesweeper<span>*</span></h1>
                <input className='textInputs' type='text' placeholder='Name' maxLength='10' id='user' />
                <input className='textInputs' type="number" placeholder='Board Size' min='5' max='20' style={{top: '55vh'}} id='size' />
                <input className='textInputs' type="number" placeholder='Bomb Ratio' min='0' max='100' style={{top: '65vh'}} id='bomb' />
                <button id='startBtn' onClick={() => {setup()}}>Start Game</button>
            </div>
        )
    }

    return (
        <div id='container'>
            <div id='rotate' style={(landscape) ? {display: 'block'} : {display: 'none'}}><h1>Please Rotate Your Device</h1></div>
            <div id='data'>
                <table>
                    <thead>
                        <tr><td id='scoreTitle' colSpan='3' style={{fontWeight: 'bolder', textDecoration: 'underline 2px solid'}}>High Scores</td></tr>
                    </thead>
                    <tbody>
                        {
                            assembleScoreboard()
                        }
                    </tbody>
                </table>
                <img
                    src={`https://quickchart.io/chart?c={
                        type:'pie',
                        data:{labels:['Safe','Bombs', 'Flagged'],
                        datasets:[{
                            data:[
                                ${safe},
                                ${bombs},
                                ${flags}
                                ],
                                backgroundColor: [
                                    "rgb(0,255,0)",
                                    "rgb(255,0,0)",
                                    "rgb(230,230,230)"
                                ],
                                borderColor: "black",
                                scaleFontColor: "white"
                            }],
                            basicOptions: {
                                legend: {
                                    position: "bottom",
                                    labels: {
                                        fontColor: "black",
                                        fontSize: 14
                                    }
                                }
                            }
                        }
                    }`}
                    alt='chart'
                />
            </div>
            <div id='gameBoard'>
                <div id='squares' style={{
                gridTemplateColumns: `repeat(${boardSize}, auto)`,
                gridGap: `${10/boardSize}vw`
                }}>
                    {
                        (user !== '') ? assembleBoard() : ''
                    }
                </div>
                <br />
                <div id='gamePanel'>
                    <div>
                        <label htmlFor='flagging'><AiFillFlag size='1.2vw' /></label>
                        <input type='checkbox' name='flagging'  onClick={() => {setFlagging(!flagging)}} />
                    </div>
                    <div>
                        <button id='restartBtn' onClick={() => {reset()}}>Restart</button>  
                    </div>
                    <div>
                        <p onClick={() => {uploadScore()}}>
                            Score: {score}
                        </p>
                    </div>
                </div>
            </div>  
        </div>
    )
}

export default App
