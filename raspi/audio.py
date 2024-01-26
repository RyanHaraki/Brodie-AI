import Pi.GPIO as GPIO 
import pyaudio 
import wave 
import requests 
import simpleaudio as sa

buttonPin = 12 # define buttonPin
ledPin = 11 # define ledPin
chunk = 1024
sample_format = pyaudio.paint16
channels = 2
fs = 44100
seconds = 3
filenane = 'output.wav'
p = pyaudio.PyAudio()
hasClicked = False
frames = []
stream = None
wf = None

# Setup the GPIO board
def setup():
    GPIO.setmode(GPIO.BOARD) # Use PHYSICAL GPIO Numbering
    GPIO.setup(ledPin, GPIO.OUT) # set ledpin to OUTPUT mode
    GPIO.setup(buttonPin, GPIO.IN, pull_up_down=GPIO.PUD_UP) # set buttonPin to PULL UP INPUT mode

# Handler for when the user clicks the button on the breadboard 
# On first click, listen for audio. On second click, save audio and call conversate()
def buttonEvent(channel):
    global hasClicked, stream, frames, wf

    if not hasClicked:
        print("Audio capture started")
        stream = p.open(format=sample_format,
                        channels=channels,
                        rate=fs,
                        frames_per_buffer=chunk,
                        input=True)
        
        frames = []
        GPIO.output(ledPin, GPIO.HIGH) # turn on LED

        while GPIO.input(buttonPin) == GPIO.HIGH:
            data = stream.read(chunk)
            frames.append(data)

        hasClicked = True
    else:
        print("Audio capture stopped")
        GPIO.output (LedPin, GPIO.LOW) # turn off led
        # stop and close the stream
        stream.stop_stream()
        stream.close()
        # save the recorded data as a .WAV file
        wf = wave.open(filename, 'wb')
        wf.setnchannels(channels)
        wf.setsampwidth(p.get_sample_size(sample_format))
        wf.setframerate(fs)
        wf.writeframes(b''.join(frames))
        wf.close()

        conversate()
        hasClicked = False
        # Re-initialize the stream for the next recording
        stream = None
        frames = []

# This function handles the conversation by sending the .WAV file to the API and playing the response
# You need to provide your own server in place of your_server
def conversate():
    global hasClicked
    url = "htttps://your_backend_url/conversate"
    data = open('output.wav', 'rb')

    r = requests.post(url, files={"audio": data})

    if r.status_code == 200:
        print("Request was successful")
        
        with open("gptresponse.wav", 'wb') as output_file:
            output_file.write(r.content)
        print("Output audio saved as 'gptresponse.wav'")
        wave_obj = sa.WaveObject.from_wave_file("gptresponse.wav")
        play_obj = wave_obj.play()
        play_obj.wait_done()

    else:
        print(f"Error: {r.status_code}")

    hasClicked = False

def loop():
    # Button detect
    GPIO.add_event_detect(buttonPin, GPIO.FALLING, callback=buttonEvent, bouncetime=300)

    while True:
        pass

def destroy():
    GPIO.output(ledPin, GPIO.LOW)   # Turn off LED
    GPIO.cleanup()                  # Release GPIO resource

if __name__ == '__main__':
    print("Program is starting...")
    setup()
    try:
        loop()
    except KeyboardInterrupt:
        destroy()
