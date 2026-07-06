/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { Fragment } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import MyBetComponent from './my-bet.component'
import moment from 'moment'
import MatchOdds from './match-odds'
import PlaceBetBox from './place-bet-box'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectBetCount, setBookMarketList } from '../../../redux/actions/bet/betSlice'
import Fancy from './fancy'
import { useWebsocketUser } from '../../../context/webSocketUser'
import MyBetComponent22 from './my-bet-component22'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { CustomLink } from '../../_layout/elements/custom-link'
import betService from '../../../services/bet.service'

const MatchDetailWrapper = (props: any) => {
  const dispatch = useAppDispatch()
  const betCount = useAppSelector(selectBetCount)
  const [tavstatus, settvstatus] = React.useState<boolean>(false)
  const { socketUser } = useWebsocketUser()
    const userState = useAppSelector(selectUserData)
  

  // React.useEffect(() => {
  //   return () => {
  //     dispatch(setBetCount(0))
  //   }
  // }, [])
const shared = useParams().share

React.useEffect(() => {
   betService
          .getBets(props.matchId)
          .then((bets) => {
            //console.log(bets.data, "chech bet data");
            bets &&
              bets.data &&
              bets.data.data &&
              // setMyAllBet(bets.data.data.bets);
            // dispatch(setbetlist(bets.data.data.bets));
            dispatch(setBookMarketList(bets.data.data.odds_profit));
            // dispatch(setBetCount(bets.data.data.bets.length));
          })
          .catch((e) => {
            console.log(e.stack);
          });
}, [props.matchId]);


  return (
    <>
      <div className='prelative'>
        <div>
          <div title='ODDS'>
          <div className='text-center'>
            <h5 style={{fontSize:"1.3rem",fontWeight:"500"}}>{props.currentMatch?.name}</h5>
            <h6 style ={{marginBottom:"20px",marginTop:"4px"}}><span style={{backgroundColor:"#6c757d",color:"#a4f827",padding: "4px"}}>{ moment(props.currentMatch?.matchDateTime).format('MM/DD/YYYY  h:mm a') }</span></h6>
          </div>

            <div className='text-Right clsforellipse mb-2' style={{justifyContent: "center",textTransform:"capitalize" }} >
              <span onClick={() => settvstatus(tavstatus ? false : true)} className=' game-heading  card-header-title giveMeEllipsis'>Live TV Fs</span>
            
            </div>
           
            {tavstatus && props.otherTv()}
            {props.scoreBoard()}




  
   



            {props.t10Tv(250)}

            <div className='markets'>
              {/* Score Component Here */}
              <div className='main-market'>
                {props.markets && <MatchOdds data={props.markets}   userState={userState} shared={shared}  />}
              </div>
            </div>
            <br />
            {props.fancies && props.currentMatch && props.currentMatch.sportId == '4' && (
              <Fragment>
                {/*@ts-expect-error */}
                {<Fancy socketUser={socketUser} fancies={props.fancies} matchId={props.matchId!} />}
              </Fragment>
            )}

             {userState?.user?.role == "user"&&<div className=''>
             
              <div className=''>
                <MyBetComponent />
              </div>
            </div>}

            {userState?.user?.role == "user"&&<div className='card m-b-10 my-bet'>
           
              <div className='card-body'>
                <MyBetComponent22 />
              </div>
            </div>}
            {props.marketDataList.stake && <PlaceBetBox stake={props.marketDataList.stake} />}
          </div>
          {/* <Tab eventKey='profile' title={`PLACED BET (${betCount})`}>
            <div className='card m-b-10 my-bet'>
              <div className='card-header'>
                <h6 className='card-title d-inline-block'>My Bet</h6>
              </div>
              <div className='card-body'>
                <MyBetComponent />
              </div>
            </div> 
          </Tab> */}
            <div className="back-main-menu my-2">
               {userState?.user?.role == "user" &&  <CustomLink to="/match/4">BACK TO INPLAY GAMES</CustomLink> }
             

             </div>
        </div>
       
      </div>
    </>
  )
}

export default React.memo(MatchDetailWrapper)
