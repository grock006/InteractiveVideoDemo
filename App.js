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
import Orientation from 'react-native-orientation';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const mockAPI = [
  {
    activityId: 1,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 16,
    interactiveScreenStart: 16,
    interactiveTargetImageStart: 16,
    interactiveButtonStart: 16,
    interactivityStart: 16,
    countdownClockStart: 16,
    interactivityDuration: 7,
    hightlightCorrectAnswerStart: 24,
    hightlightCorrectAnswerDuration: 3,
    activityEnd: 27,
    activityImages: null,
    correctAnswer: true
  },
  {
    activityId: 2,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 124,
    interactiveScreenStart: 124,
    interactiveTargetImageStart: 124,
    interactiveButtonStart: 124,
    interactivityStart: 127,
    countdownClockStart: 127,
    interactivityDuration: 10,
    hightlightCorrectAnswerStart: 136,
    hightlightCorrectAnswerDuration: 1,
    activityEnd: 137,
    activityImages: require('./assets/images/sa/s2_nose.png'),
    correctAnswer: true
  },
  {
    activityId: 3,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 138,
    interactiveScreenStart: 138,
    interactiveTargetImageStart: 138,
    interactiveButtonStart: 138,
    interactivityStart: 143,
    countdownClockStart: 143,
    interactivityDuration: 10,
    hightlightCorrectAnswerStart: 152,
    hightlightCorrectAnswerDuration: 1,
    activityEnd: 153,
    activityImages: require('./assets/images/sa/s2_ears.png'),
    correctAnswer: true
  },
  {
    activityId: 4,
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
    activityImages: require('./assets/images/tf/s1_eyes.png'), //image assets, target images, interactive icons, etc.
    correctAnswer: 'green' //correct answer to the activity question//
  },
  {
    activityId: 5,
    activityType: 'trueFalse',
    interactive: true,
    activityStart: 76,
    interactiveScreenStart: 76,
    interactiveTargetImageStart: 76,
    interactiveButtonStart: 76,
    interactivityStart: 83,
    countdownClockStart: 83,
    interactivityDuration: 5,
    hightlightCorrectAnswerStart: 89,
    hightlightCorrectAnswerDuration: 4,
    activityEnd: 93,
    activityImages: require('./assets/images/tf/s1_knee.png'),
    correctAnswer: 'red'
  },
  {
    activityId: 6,
    activityType: 'multipleChoice',
    interactive: true,
    activityStart: 192,
    interactiveScreenStart: 192,
    interactiveTargetImageStart: 192,
    interactivityStart: 195,
    countdownClockStart: 195,
    interactivityDuration: 5,
    hightlightCorrectAnswerStart: 201,
    hightlightCorrectAnswerDuration: 5,
    activityEnd: 206,
    activityImages: [ 
      require('./assets/images/mc/foot.png'), 
      require('./assets/images/mc/ear.png'), 
      require('./assets/images/mc/finger.png'), 
      require('./assets/images/mc/head.png')
    ],
    correctAnswer: 1,
  },
  {
    activityId: 7,
    activityType: 'multipleChoice',
    interactive: true,
    activityStart: 207,
    interactiveScreenStart: 207,
    interactiveTargetImageStart: 207,
    interactivityStart: 209,
    countdownClockStart: 209,
    interactivityDuration: 5,
    hightlightCorrectAnswerStart: 216,
    hightlightCorrectAnswerDuration: 2,
    activityEnd: 218,
    activityImages: [ 
      require('./assets/images/mc/body.png'), 
      require('./assets/images/mc/finger.png'), 
      require('./assets/images/mc/feet.png'), 
      require('./assets/images/mc/hand.png')
    ],
    correctAnswer: 3,
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
       isMuted: false,
       interactiveContainer: true,
       trueFalse: false,
       trueFalseImageContainer: false,
       trueFalseButtonsContainer: false,
       trueFalseSelected: null,
       trueFalseCorrect: false,
       trueFalseCheckmark: false, 
       trueFalseCorrectAnswer: null,
       trueFalseImage: null,
       speechActivity: true,
       speechActivityImageContainer: true,
       speechActivityButtonsContainer: true,
       speechActivityCorrectAnswer: false,
       speechActivityImage: null,
       multipleChoice: false,
       multipleChoiceAnswer: null,
       multipleChoiceSelected: null,
       multipleChoiceImages: [],
       multipleChoiceCheckmark: false,
       multipleChoiceCorrectAnswer: null,
       countdownClock: false,
       resultsScreen: false
     }
  }

  componentDidMount() {
    Orientation.lockToLandscape()
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
        trueFalseSelected: null,
        trueFalseCorrect: false,
        trueFalseCheckmark: false, 
        trueFalseCorrectAnswer: null,
        trueFalseImage: null,
      });
    }
    if (activityType === 'multipleChoice') {
      this.setState({
        interactiveContainer: false,
        multipleChoice: false,
        multipleChoiceAnswer: null,
        multipleChoiceSelected: null,
        multipleChoiceImages: [],
        multipleChoiceCheckmark: false,
        multipleChoiceCorrectAnswer: null,
      });
    }
    if (activityType === 'speechActivity') {
      this.setState({
        interactiveContainer: false,
        speechActivity: false,
        speechActivityImageContainer: false,
        speechActivityButtonsContainer: false,
        speechActivityImage: null,
        speechActivityCorrectAnswer: false,
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
    if (activityType === 'multipleChoice') {
      this.setState({
        multipleChoiceCorrectAnswer: correctAnswer
      })
      if (correctAnswer === this.state.multipleChoiceSelected) {
        this.incrementTicketCounter();
      }
    }
    if (activityType === 'speechActivity') {
      this.setState({
        speechActivityCorrectAnswer: true
      })
      if (correctAnswer) {
        //this.incrementTicketCounter();
      }
    }    
  }

  _setHighlightCorrectAnswer = (boolean, activityType) => {
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalseCheckmark: boolean
      });
    }
    if (activityType === 'multipleChoice') {
      this.setState({
        multipleChoiceCheckmark: boolean
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

  _setInteractiveTargetImageDisplay = (boolean, activityType, activityImages) => {
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalseImageContainer: boolean,
        trueFalseImage: activityImages
      });
    }
    if (activityType === 'multipleChoice') {
      this.setState({
        multipleChoice: boolean,
        multipleChoiceImages: activityImages
      });
    }
    if (activityType === 'speechActivity') {
      this.setState({
        speechActivity: boolean,
        speechActivityImageContainer: boolean,
        speechActivityImage: activityImages
      });
    }

  };

  _setInteractiveTargetButtonsDisplay = (boolean, activityType) => {
    if(activityType === 'trueFalse') {
      this.setState({
        trueFalseButtonsContainer: boolean
      });
    }
    if(activityType === 'speechActivity') {
      this.setState({
        speechActivityButtonsContainer: boolean
      });
    }
  };

  _onPressTrueFalse = (answer) => {
    this.setState({
      trueFalseSelected: answer
    });
  };

  _onPressSpeechRecognition = () => {
    //alert('wassup')
    fetch('https://www.abcmouse.com/apis/sws/0.1/json/Resource/Enumerate/init', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstParam: 'yourValue',
        secondParam: 'yourOtherValue',
      }),
    }).then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  _onPressMultipleChoice = (answer) => {
    this.setState({
      multipleChoiceSelected: answer
    });
  };

  _onVideoLoad = (status) => {
    this.setState({
      isVideoLoaded: true
    });
    this.player.seek(54);
  };

    _onPressReloadVideo = () => {
    if(this.player !== null) {
      this.player.seek(0);
      this.setState({
        ticketCounter: 0,
        countdownClockSeconds: null,
        isVideoLoaded: false,
        isPaused: false,
        isMuted: false,
        interactiveContainer: false,
        trueFalse: false,
        trueFalseImageContainer: false,
        trueFalseButtonsContainer: false,
        trueFalseSelected: null,
        trueFalseCorrect: false,
        trueFalseCheckmark: false, 
        trueFalseCorrectAnswer: null,
        trueFalseImage: null,
        speechActivity: false,
        speechActivityImageContainer: false,
        speechActivityButtonsContainer: false,
        speechActivityCorrectAnswer: false,
        speechActivityImage: null,
        multipleChoice: false,
        multipleChoiceAnswer: null,
        multipleChoiceSelected: null,
        multipleChoiceImages: [],
        multipleChoiceCheckmark: false,
        multipleChoiceCorrectAnswer: null,
        countdownClock: false,
        resultsScreen: false
      });
    }
  }

  _onVideoProgress = (status) => {
    //console.log(status.currentTime)
    if (this.state.isVideoLoaded) {
      //this._playInteractiveSequence(status)
    }
  }

  _onVideoMount = component => {
    this._video = component;
    this.player = this._video;
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
          this._setInteractiveTargetImageDisplay(true, mockAPI.activityType, mockAPI.activityImages);
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
              <Image style={styles.reloadIcon} source={require('./assets/images/refresh.png')} />
            </TouchableOpacity>
          </View>
          <Video
            ref={this._onVideoMount}
            controls={true}
            rate={1.0}
            volume={1.0}
            paused={this.state.isPaused}
            muted={this.state.isMuted}
            onLoad={this._onVideoLoad}
            onProgress={this._onVideoProgress}
            style={[styles.video, { width: DEVICE_WIDTH, height: DEVICE_HEIGHT }]}
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
                    <Image style={styles.trueFalseImage} source={this.state.trueFalseImage} />
                </View>
              }
              {this.state.trueFalseButtonsContainer && <View style={styles.trueFalseButtonsContainer}>
                <View style={[
                  styles.trueFalseGreenYesButtonHighlight,
                  this.state.trueFalseSelected === 'green' ? styles.trueFalseGreenYesButtonHighlightSelected : {}
                  ]}>
                  <TouchableOpacity 
                    onPress={() => this._onPressTrueFalse('green')}
                    disabled={Boolean(this.state.trueFalseSelected) || !this.state.countdownClock}
                    style={styles.trueFalseGreenYesButton}>
                      {this.state.trueFalseCheckmark && (this.state.trueFalseCorrectAnswer === 'green') &&
                        <View style={styles.trueFalseCheckmarkContainer}>
                          <Image source={require('./assets/images/checkmark.png')} />
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
                    disabled={Boolean(this.state.trueFalseSelected) || !this.state.countdownClock}
                    style={styles.trueFalseRedNoButton}
                    >
                    {this.state.trueFalseCheckmark && (this.state.trueFalseCorrectAnswer === 'red') &&
                      <View style={styles.trueFalseCheckmarkContainer}>
                        <Image source={require('./assets/images/checkmark.png')} />
                      </View>
                    }
                  </TouchableOpacity>
                  </View>


              </View>}





              {this.state.speechActivity && 
                <View style={styles.speechActivityContainer}>
              
                {this.state.speechActivityImageContainer && 
                  <View style={styles.speechActivityImageContainer}>
                    <Image style={styles.speechActivityImage} source={this.state.speechActivityImage} />
                  </View>
                }

                {this.state.speechActivityButtonsContainer &&
                  <TouchableOpacity onPress={() => this._onPressSpeechRecognition()}>>
                    <View style={styles.speechActivityIconContainer}>
                      {!this.state.speechActivityCorrectAnswer &&
                        <Image style={styles.speechActivityIcon} source={require('./assets/images/microphone.png')} />
                      }
                      {this.state.speechActivityCorrectAnswer &&
                        <Image style={styles.speechActivityIcon} source={require('./assets/images/star.png')} />
                      }
                    </View>
                  </TouchableOpacity>
                }
              
              </View>
            }







              
              {this.state.multipleChoice && 
                <View style={styles.multipleChoiceContainer}>
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected) || !this.state.countdownClock}    
                    onPress={() => this._onPressMultipleChoice(1)}>
                    <View style={[styles.multipleChoiceImageContainer,
                      this.state.multipleChoiceSelected === 1 ? styles.multipleChoiceImageContainerSelected : {},
                      (this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 1)) ? styles.multipleChoiceImageContainerCorrect : {}
                      ]}>
                      <Image style={styles.multipleChoiceImage} source={this.state.multipleChoiceImages[0]}  />
                      { this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 1) &&
                        <View style={styles.multipleChoiceCheckmarkContainer}>
                          <Image source={require('./assets/images/green_circle_checkmark.png')} />
                        </View>
                      }
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected) || !this.state.countdownClock}
                    onPress={() => this._onPressMultipleChoice(2)}>
                    <View style={[styles.multipleChoiceImageContainer,
                       this.state.multipleChoiceSelected === 2 ? styles.multipleChoiceImageContainerSelected : {},
                       (this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 2)) ? styles.multipleChoiceImageContainerCorrect : {}
                      ]}>
                      <Image style={styles.multipleChoiceImage} source={this.state.multipleChoiceImages[1]}   />
                      { this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 2) &&
                        <View style={styles.multipleChoiceCheckmarkContainer}>
                          <Image source={require('./assets/images/green_circle_checkmark.png')} />
                        </View>
                      }
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected) || !this.state.countdownClock}
                    onPress={() => this._onPressMultipleChoice(3)}>              
                    <View style={[styles.multipleChoiceImageContainer,
                      this.state.multipleChoiceSelected === 3 ? styles.multipleChoiceImageContainerSelected : {},
                      (this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 3)) ? styles.multipleChoiceImageContainerCorrect : {}
                      ]}>
                      <Image style={styles.multipleChoiceImage} source={this.state.multipleChoiceImages[2]}   />
                      { this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 3) &&
                        <View style={styles.multipleChoiceCheckmarkContainer}>
                          <Image source={require('./assets/images/green_circle_checkmark.png')} />
                        </View>
                      }
                    </View>
                  </TouchableOpacity>                  
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected) || !this.state.countdownClock}
                    onPress={() => this._onPressMultipleChoice(4)}>
                    <View style={[styles.multipleChoiceImageContainer,
                      this.state.multipleChoiceSelected === 4 ? styles.multipleChoiceImageContainerSelected : {},
                      (this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 4)) ? styles.multipleChoiceImageContainerCorrect : {}
                      ]}>
                      <Image style={styles.multipleChoiceImage} source={this.state.multipleChoiceImages[3]}   />
                      { this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 4) &&
                        <View style={styles.multipleChoiceCheckmarkContainer}>
                          <Image source={require('./assets/images/green_circle_checkmark.png')} />
                        </View>
                      }
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
  safeArea: {
    flex: 1,
    backgroundColor: '#000000'
  },
  videoContainer: {
    flex: 1,
    height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH,
    backgroundColor: '#000000',
    position: 'relative'
  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  reloadContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 10
  },
  reloadIcon: {
    height: 35,
    width: 35
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
    width: 350,
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
    justifyContent: 'center'
  },
  trueFalseImage: {
    alignSelf: 'center',
    width: 135, 
    height: 135
  },
  trueFalseButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    width: 270,
    justifyContent: 'space-between'
  },
  trueFalseCheckmarkContainer: {
  },
  trueFalseRedNoButton: {
    height: 75,
    width: 75,
    backgroundColor: '#C30016',
    borderRadius: 50,
    borderColor: 'transparent',
    borderWidth: 10,
    zIndex: 5,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
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
    justifyContent: 'center',
    alignItems: 'center'
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
    height: 150,
    width: 160,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#898989',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  speechActivityImage: {
    height: 125,
    width: 125,
    alignSelf: 'center'
  },
  speechActivityIconContainer: {
    alignSelf: 'center',
    marginTop: 15,
    zIndex: 3
  },
  speechActivityIcon: {
    width: 90,
    height: 90
  },
  multipleChoiceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5
  },
  multipleChoiceImageContainer: {
    zIndex: 3,
    position: 'relative',
    height: 130,
    width: 160,
    borderWidth: 2,
    borderColor: '#898989',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  multipleChoiceCheckmarkContainer: {
    position: 'absolute',
    top: 5,
    left: 5
  },
  multipleChoiceImageContainerSelected: {
    borderWidth: 10, 
    borderColor: 'rgb(242, 157, 48)'
  },
  multipleChoiceImageContainerCorrect: {
    borderWidth: 10, 
    borderColor: '#48AA09'
  },
  multipleChoiceImage: {
    alignSelf: 'center',
    height: 115,
    width: 115
  }
});
