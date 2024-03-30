# Brodie AI
Brodie AI is a wearable conversational AI bot powered by the OpenAI completions API, as well as Azures TTS and STT APIs. This repo contains the code running on both the Raspberry Pi and server so that you can recreate it.

**DISCLAIMER**: This code is NOT perfect. It's buggy and we built this in 24 hours during a hackathon, but it works and you can probably do it better.

## Pre-reqs (what we used)
- Raspberry Pi 2B (you can use any model)
- Any computer that can run a server + Ngrok to tunnel for local development and testing
- A Rapsberry Pi kit, ([the one we used](https://www.amazon.ca/Freenove-Raspberry-Contained-Compatible-Tutorials/dp/B09H2TFRN2/ref=sr_1_29?dib=eyJ2IjoiMSJ9.s8M3KliPTdTWVjXuAVTeVZEf5tkGHTvpNDEAMoeJug3gwCvDPFBTSKEXhA2zQAd6GAWOqM5vWimV_ds74eBg8J6puokLA-IgBuuk5_Y96bwV4PjQcPkMuc_3uEKQCIf7A6okO16Gb0Q8s7KII3I-3_HNCMRJk1uvea8lN5domFMLeyO2XN-AdPkzlRs2vYbrvISTZslBDhDqUSibo4UTN-WH2AJJHd_WuxJqSlZyoUfVKu3Ap-R51GY5gpPtRJA-EV529fm0EWJx_L2yUKy-hyvqO8XAWgw9vIETewemlCc.DBNG--1BioNjWg01otRc15egM0x1bkTkgP_x0ytBtME&dib_tag=se&keywords=raspberry+pi+kit&qid=1708834804&sr=8-29&th=1)) or a breadboard, button, some resistors/wires, and a way to connect to the GPIO on the Pi.

## How does it work?

There's a python script running on the Rapsberry Pi listening for a button input on the board. Once a user has clicked, the microphone listens for the audio and saves a .WAV file into the directory on the second button click. The `conversate` function is called which pings the API with the .WAV file.

The API takes the file, pushes it to Azure Speech to Text API, sends the text to the OpenAI Completions API, and finally we send that to Azure's TTS API and send the .wav file back to the user, and the script plays the audio file back.

Please DM @ryan_haraki on Twitter if you need any help! You're free to re-use this code in your own projects.

Credits go to [Borna Shani](https://www.linkedin.com/in/borna-shani), [Alison Hardy](https://github.com/alichiba), and [Ryan Haraki](https://github.com/ryanharaki).
