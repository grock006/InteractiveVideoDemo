import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar, 
  Image, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions
} from 'react-native';
import Video from 'react-native-video';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const atTimescale = 1000000000;
const mockAPI = [
  {
    activityId: 1,
    activityType: 'trueFalse',
    interactive: true,
    activityStart: 54, //time to start interactive segment within overall video, in seconds
    interactiveScreenStart: 54, //time to display interactive screen
    interactiveTargetImageStart: 54, //time to display activity target image or images
    interactiveButtonStart: 54, //time to display interactive buttons, non-clickable, could also be microphone
    redButtonHighlightStart: 59, //time to display red button highlight
    greenButtonHighlightStart: 58, //time to display green button highlight
    buttonHighlightDuration: 2, //duration for button highlight
    interactivityStart: 60, //time to allow user interactivity, start countdown clock 
    countdownClockStart: 60, //time to display clock countdown, should be same as interactivityStart
    interactivityDuration: 6, //total time for user interactivity, can use instead of countdown duration
    hightlightCorrectAnswerStart: 67, //time to highlight correct answer
    hightlightCorrectAnswerDuration: 5, //duration to highlight correct answer
    activityEnd: 72, //time to end all activity screens
    activityTotalDuration: 18, //total time for activity start to finish, everything included
    assets: [], //image assets, target images, interactive icons, etc.
    correctAnswer: 'green' //correct answer to the activity question//
  }
];

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
     this.interactionTimeout = null;
     this.t = true;
     this.f = false;
     this.playbackInstance = null;
     this.state = {
       ticketCounter: 0,
       countdownClockSeconds: null,
       isVideoLoaded: false,
       isPaused: this.t,
       isMuted: true,
       playbackInstancePosition: null,
       playbackInstanceDuration: null,
       interactiveContainer: false,
       trueFalse: false,
       trueFalseImageContainer: false,
       trueFalseButtonsContainer: false,
       trueFalseSelected: null,
       trueFalseCorrect: false,
       trueFalseCorrectAnswer: null,
       speechActivity: false,
       multipleChoice: false,
       multipleChoiceAnswer: null,
       multipleChoiceSelected: null,
       countdownClock: false,
       resultsScreen: false
     }
  }

  countdownClock() {
    this.setState(prevState => ({
      countdownClockSeconds: prevState.countdownClockSeconds - 1
    }));
  }

  incrementTicketCounter() {
    this.setState(prevState => ({
      ticketCounter: prevState.ticketCounter + 1
    }));
  }

  _setActivityEnd = (activityType) => {
    if (activityType === 'trueFalse') {
      this.setState({
        interactiveContainer: false,
        trueFalse: false,
        trueFalseImageContainer: false,
        trueFalseButtonsContainer: false,
        trueFalseCorrect: false
      });
    }
  };

  _checkAnswer = (correctAnswer, activityType) => {
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalseCorrectAnswer: correctAnswer
      })
      if (correctAnswer === this.state.trueFalseSelected) {
        this.incrementTicketCounter();
      }
    } 
  }

  _setHighlightCorrectAnswer = (boolean, activityType) => {
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalseCheckmark: boolean
      });
    }
  };

  _setCountdownClockSeconds = (countdownClockSeconds) => {
    this.setState({
      countdownClockSeconds: countdownClockSeconds
    });
  };

  _setCountdownClockDisplay = (boolean) => {
    this.setState({
      countdownClock: boolean
    });
  };

  _setInteractiveContainerDisplay = (boolean) => {
    this.setState({
      interactiveContainer: boolean
    });
  };

  _setInteractiveTargetImageDisplay = (boolean, activityType) => {
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalseImageContainer: boolean
      });
    }
  };

  _setInteractiveTargetButtonsDisplay = (boolean, activityType) => {
    if(activityType === 'trueFalse') {
      this.setState({
        trueFalseButtonsContainer: boolean
      });
    }
  };

  _setActivityType = (activityType) => {
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalse: true
      });
    }
    if (activityType === 'multipleChoice') {
      this.setState({
        trueFalse: false,
        multipleChoice: true
      });
    }
    if (activityType === 'speechActivity') {
      this.setState({
        trueFalse: false,
        multipleChoice: false,
        speechActivity: true
      });
    }
  };

  _onPressTrueFalse = (answer) => {
    this.setState({
      trueFalseSelected: answer
    });
  };

  _onPressMultipleChoice = (answer) => {
    this.setState({
      multipleChoiceSelected: answer
    });
  };

  _onVideoLoad = (status) => {
    this.setState({
      isVideoLoaded: true
    });
  };

  _onVideoProgress = (status) => {
    if (this.state.isVideoLoaded) {
      this._playInteractiveSequence(status)
    }
  }

  _onVideoMount = component => {
    this._video = component;
    this.playbackInstance = this._video;
  }

  _playInteractiveSequence = (status) => {
    if (status && mockAPI) {

      mockAPI.forEach((mockAPI) => {
        // activityStart: 3, //time to start interactive segment within overall video, in seconds
        // interactiveScreenStart: 3, //time to display interactive screen
        // activityType: 'trueFalse',
        // interactive: true,
        //console.log('status.currentTime', status.currentTime, atTimescale)
        //console.log('Math.round(status.currentTime)', Math.round(status.currentTime))
        //console.log('mockAPI.activityStart', mockAPI.activityStart)
        if (Math.round(status.currentTime) === mockAPI.activityStart ) {
          this._setInteractiveContainerDisplay(true);
        }

        //interactiveTargetImageStart: 5, //time to display activity target image or images
        if (Math.round(status.currentTime) === mockAPI.interactiveTargetImageStart ) {
          //console.log('Math.round(status.currentTime)', Math.round(status.currentTime), 'mockAPI.interactiveTargetImageStart ', mockAPI.interactiveTargetImageStart )
          this._setInteractiveTargetImageDisplay(true, mockAPI.activityType);
        }

        // interactiveButtonStart: 7, //time to display interactive buttons, non-clickable, could also be microphone
        if (Math.round(status.currentTime) === mockAPI.interactiveButtonStart ) {
          this._setInteractiveTargetButtonsDisplay(true, mockAPI.activityType);
        }
        
        // redButtonHighlightStart: 8, //time to display red button highlight
        // buttonHighlightDuration: 2, //duration for button highlight
        if (Math.round(status.currentTime) === mockAPI.redButtonHighlightStart ) {
          this._onPressTrueFalse('red')
          this.redButtonHighlightTimeout = setTimeout(
            () => {
              this._onPressTrueFalse(null)
            }, mockAPI.buttonHighlightDuration * 1000
          );
        }

        // greenButtonHighlightStart: 9, //time to display green button highlight
        // buttonHighlightDuration: 2, //duration for button highlight
        if (Math.round(status.currentTime) === mockAPI.greenButtonHighlightStart ) {
          this._onPressTrueFalse('green')
          this.greenButtonHighlightTimeout = setTimeout(
            () => {
              this._onPressTrueFalse(null);
            }, mockAPI.buttonHighlightDuration * 1000
          );
        }
        
        // buttons are gray and disabled before this
        // this.state.trueFalseDisabled
        // styles.trueFalseDisabled
        // needs to be set depending on activityType
        // interactivityStart: 10, //time to allow user interactivity, start countdown clock 
        // countdownClockStart: 10, //time to display clock countdown, should be same as interactivityStart
        // interactivityDuration: 5, //total time for user interactivity, can use instead of countdown duration
        if (Math.round(status.currentTime) === mockAPI.interactivityStart ) {
          this._setCountdownClockDisplay(true);
          this._setCountdownClockSeconds(mockAPI.interactivityDuration)
          this.countdownClockInterval = setInterval(
            () => {
              this.countdownClock()
              if(this.state.countdownClockSeconds < 0) {
                clearInterval(this.countdownClockInterval);
                this._setCountdownClockDisplay(false);
              }
            }, 1000
          );
        }
        
        // hightlightCorrectAnswerStart: 15, //time to highlight correct answer
        // hightlightCorrectAnswerDuration: 3, //duration to highlight correct answer
        // check correctAnswer: 'red' //correct answer to the activity question
        // Tickercounter increments if correct
        if (Math.round(status.currentTime) === mockAPI.hightlightCorrectAnswerStart ) {
          //running twice
          //console.log('Math.round(status.positionMillis / 1000', Math.round(status.currentTime));
          //console.log('mockAPI.hightlightCorrectAnswerStart', mockAPI.hightlightCorrectAnswerStart);
          this._checkAnswer(mockAPI.correctAnswer, mockAPI.activityType);
          this._setHighlightCorrectAnswer(true, mockAPI.activityType);
          this.highlightCorrectAnswerTimeout = setTimeout(
            () => {
              this._setHighlightCorrectAnswer(false, mockAPI.activityType);
            }, mockAPI.hightlightCorrectAnswerDuration * 1000
          )
        }
        
        // activityEnd: 20, //time to end activity, hide all screens
        if (Math.round(status.currentTime) === mockAPI.activityEnd ) {
          this._setActivityEnd(mockAPI.activityType);
          clearTimeout(this.highlightCorrectAnswerTimeout);
          clearTimeout(this.greenButtonHighlightTimeout);
          clearTimeout(this.redButtonHighlightTimeout);
          //RESET EVERYTHING
        }



      });
    
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar hidden={true}/>
        <View style={styles.videoContainer}>
          <View style={styles.reloadContainer}>
            <TouchableOpacity 
              onPress={() => this._onPressReloadVideo()}>

            </TouchableOpacity>
          </View>
          <Video
            ref={this._onVideoMount}
            controls={true}
            rate={1.0}
            volume={1.0}
            paused={true}
            muted={this.state.isMuted}
            onLoad={this._onVideoLoad}
            onProgress={this._onVideoProgress}
            style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
            source={{ uri: 'https://s3-us-west-1.amazonaws.com/gr-video-assets/180302_Wordplay_Demo_v1.mp4' }}
          />

          <View style={styles.ticketContainer}>
            <Image style={styles.ticketCounterIcon} source={require('./assets/images/tickets.png')} />
            <Text style={styles.ticketCounterPlus}>{ this.state.ticketCounter > 0 ? '+' : ''}</Text>
            <Text style={styles.ticketCounter}>{this.state.ticketCounter}</Text>
          </View>

            {this.state.countdownClock && 
              <View style={styles.countdownClockContainer}>
                <Image style={styles.countdownClockIcon} source={require('./assets/images/timer.png')} />
                <Text style={styles.countdownClockSeconds}>{this.state.countdownClockSeconds}</Text>
              </View>
            }
          
            {this.state.interactiveContainer && <View style={styles.interactiveContainer}>

              {this.state.trueFalseImageContainer && 
                <View style={styles.trueFalseImageContainer}>
                    <Image style={styles.trueFalseImage} source={require('./assets/images/tf_s1_eyes.png')} />
                </View>
              }
              {this.state.trueFalseButtonsContainer && <View style={styles.trueFalseButtonsContainer}>
                <View style={[
                  styles.trueFalseGreenYesButtonHighlight,
                  this.state.trueFalseSelected === 'green' ? styles.trueFalseGreenYesButtonHighlightSelected : {}
                  ]}>
                  <TouchableOpacity 
                    onPress={() => this._onPressTrueFalse('green')}
                    disabled={Boolean(this.state.trueFalseSelected)}
                    style={styles.trueFalseGreenYesButton}>
                      {this.state.trueFalseCheckmark && (this.state.trueFalseCorrectAnswer === 'green') &&
                        <View style={styles.trueFalseCheckmarkContainer}>

                        </View>
                      }
                  </TouchableOpacity>
                </View>

                <View style={[
                  styles.trueFalseRedNoButtonHighlight,
                  this.state.trueFalseSelected === 'red' ? styles.trueFalseRedNoButtonHighlightSelected : {}
                  ]}>
                  <TouchableOpacity 
                    onPress={() => this._onPressTrueFalse('red')}
                    disabled={Boolean(this.state.trueFalseSelected)}
                    style={styles.trueFalseRedNoButton}
                    >
                    {this.state.trueFalseCheckmark && (this.state.trueFalseCorrectAnswer === 'red') &&
                      <View style={styles.trueFalseCheckmarkContainer}>

                      </View>
                    }
                  </TouchableOpacity>
                  </View>


              </View>}

              {this.state.speechActivity && <View style={styles.speechActivityContainer}>
                <View style={styles.speechActivityImageContainer}></View>
                <View style={styles.speechActivityMicrophoneContainer}></View>
              </View>}
              
              {this.state.multipleChoice && 
                <View style={styles.multipleChoiceContainer}>
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected)}
                    onPress={() => this._onPressMultipleChoice(1)}>
                    <View style={[styles.multipleChoiceImageContainer,
                      this.state.multipleChoiceSelected === 1 ? styles.multipleChoiceImageContainerSelected : {}
                      ]}>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected)}
                    onPress={() => this._onPressMultipleChoice(2)}>
                    <View style={[styles.multipleChoiceImageContainer,
                       this.state.multipleChoiceSelected === 2 ? styles.multipleChoiceImageContainerSelected : {}
                      ]}>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected)}
                    onPress={() => this._onPressMultipleChoice(3)}>              
                    <View style={[styles.multipleChoiceImageContainer,
                      this.state.multipleChoiceSelected === 3 ? styles.multipleChoiceImageContainerSelected : {}
                      ]}>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected)}
                    onPress={() => this._onPressMultipleChoice(4)}>
                    <View style={[styles.multipleChoiceImageContainer,
                      this.state.multipleChoiceSelected === 4 ? styles.multipleChoiceImageContainerSelected : {}
                      ]}>
                    </View>
                  </TouchableOpacity>
                </View>}
          
            </View>}

          {this.state.resultsScreen &&
            <View style={styles.resultsScreen}>
              <Text style={styles.resultsScreenText}>Unit Review Scorecard</Text>
            </View>
          }
        
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000000'
  },
  videoContainer: {
    flex: 1,
    height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH,
    backgroundColor: '#000000',
    justifyContent: 'center'
  },
  reloadContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 10
  },
  ticketContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 100,
    borderWidth: 0,
    borderColor: '#6C686D',
    backgroundColor: '#ffffff',
    position: 'absolute',
    right: 15,
    top: 10,
    borderRadius: 50
  },
  ticketCounter: {
    color: '#F0951C',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    height: 35,
    width: 20
  },
  ticketCounterIcon: {
    width: 32,
    height: 25,
    marginRight: 5
  },
  ticketCounterPlus: {
    color: '#F0951C',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
    width: 15
  },
  countdownClockContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 100,
    borderColor: 'transparent',
    borderWidth: 3,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    position: 'absolute',
    right: 120,
    top: 10
  },
  countdownClockSeconds: {
    color: '#F0951C',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    height: 35,
    width: 35
  },
  countdownClockIcon: {
    width: 25,
    height: 25
  },
  resultsScreen: {
    zIndex: 2,
    backgroundColor: 'rgb(213, 221, 234)',
    height: 280,
    width: 450,
    borderWidth: 5,
    borderColor: 'rgb(60, 123, 218)',
    borderRadius: 15,
    alignSelf: 'center'
  },
  resultsScreenText: {
    alignSelf: 'center',
    color: '#001A66',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20
  },
  interactiveContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute', 
    zIndex: 2,
    top: 60,
    right: 15, 
    backgroundColor: 'rgba(213, 221, 234, 0.5)',
    height: 290,
    width: 400,
    borderWidth: 1,
    borderColor: '#898989',
    borderRadius: 15,
  },
  trueFalseImageContainer: {
    zIndex: 3,
    position: 'relative',
    height: 150,
    width: 250,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#898989',
    borderRadius: 15,
    backgroundColor: '#ffffff',
  },
  trueFalseImage: {
    alignSelf: 'center',
    marginTop: 10,
    width: 150, 
    height: 150
  },
  trueFalseButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    width: 270,
    justifyContent: 'space-between'
  },
  trueFalseCheckmarkContainer: {
    top: -20,
    alignSelf: 'center',
    position: 'absolute'
  },
  trueFalseRedNoButton: {
    height: 75,
    width: 75,
    backgroundColor: '#C30016',
    borderRadius: 50,
    borderColor: 'transparent',
    borderWidth: 10,
    zIndex: 5,
    position: 'absolute'
  },
  trueFalseRedNoButtonHighlight: {
    borderColor: 'rgba(195, 0, 22, 0.0)',
    height: 100,
    width: 100,
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderWidth: 5,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  trueFalseRedNoButtonHighlightSelected: {
    borderColor: 'rgba(195, 0, 22, 1)'
  },
  trueFalseDisabled: {
    opacity: 0.4
  },
  trueFalseGreenYesButton: {
    height: 75,
    width: 75,
    backgroundColor: '#48AA09',
    borderRadius: 50,
    borderColor: 'transparent',
    borderWidth: 10,
    zIndex: 5,
    position: 'absolute',
  },
  trueFalseGreenYesButtonHighlight: {
    borderColor: 'transparent',
    height: 100,
    width: 100,
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderWidth: 5,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  trueFalseGreenYesButtonHighlightSelected: {
    borderColor: '#48AA09'
  },
  speechActivityContainer: {

  },
  speechActivityImageContainer: {
    zIndex: 3,
    position: 'relative',
    height: 125,
    width: 175,
    marginTop: 25,
    borderWidth: 5,
    borderColor: '#3C7BDA',
    borderRadius: 15,
    backgroundColor: '#ffffff',
  },
  speechActivityMicrophoneContainer: {
    width: 50,
    height: 100,
    borderColor: '#3C7BDA',
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 10,
    zIndex: 3,
    backgroundColor: '#ffffff'
  },
  multipleChoiceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  multipleChoiceImageContainer: {
    zIndex: 3,
    position: 'relative',
    height: 120,
    width: 180,
    borderWidth: 5,
    borderColor: 'rgba(60, 123, 218, 0.7)',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginBottom: 5
  },
  multipleChoiceImageContainerSelected: {
    borderWidth: 10, 
    borderColor: '#1B53B1'
  }
});
