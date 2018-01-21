---
title: QCLOCK - The RGB LED wall clock, part 1
description: "Guide to make your own RGB LED wall clock, using a Tessel, Neopixels and JavaScript - first, the hardware part"
categories:
- writing
tags:
- iot
- led
- tessel
- fadecandy
- neopixels
- diy
---

<div class="youtube full"><iframe src="https://www.youtube.com/embed/VG4yphlYwe4?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="full"></iframe></div>

This will be the story and a guide of how you can create a wall clock like on this video. It’s a digital clock, the outer light is the “long arm” for the minutes, the inner light is the “short arm” for the hours. The time, colors, method of showing the time, animations - all can be controlled on a small website, hosted by the clock itself.

The plan is to publish in two parts, the software will come soon, but first: the hardware.

## Backstory

Years ago we’ve bought a nice Braun wall clock and we loved it. It was clean, minimalistic, and what the family valued most: quiet. Years passed, and it became louder - well, relatively louder, it’s ticking was almost inaudible for me, but it bugged the rest of the family. We endured for a few weeks, then set off to get a new wall clock.

But the available clocks were terrible! Either large rectangles, with boring liquid-crystal displays, or loud mechanical ones. Some had alarmingly red glowing numbers… so in the end, the stressful “meh, I should build one” moment came!

Let’s see the specification:
- round (I’m kind of a conservative, on the topic of wall clocks)
- has arms (see above)
- quiet - has _absolutely_ no sound
- minimalistic
- does not light up the room in the evening
- but can be seen in the dark
- does not cost a fortune

## Planning & Ingredients

Some ideas emerged, like magnetic arms, huge e-ink numbers (turns out there is such a thing), words, but none of these was right for us. Then one spring afternoon having coffee, an idea popped into my mind and started drawing. The project looked really promising as this plan was based on a few hardware elements, I was familiar with:
- NeoPixel RGB LEDs
- Tessel Microcontroller


{% image_tag "pull-right" "neopixels.jpg" "Neopixel LED strip" %}

### NeoPixel LED strips

[NeoPixels](https://www.adafruit.com/category/168) are bright, RGB - or RGBW, if you choose those - LEDs, which can be connected to each other, to form a strip of lights. To make things even more awesome, you can program a whole strip at the beginning, using 3 pins:
- Ground point, 
- the signal input, 
- a 5V power source, where the longer your LED strip the more current it will need (sometimes more than 2 Amperes!)

The LED strips are available with various “resolutions” -  the number of LEDs on a 1-meter strip. I picked the average one, simple RGB with 60 LEDs on a meter. I needed approximately twice of the circumference of the planned clock since there is a strip inside and outside of the round frame.

### Tessel 2

To control the NeoPixels, you’ll need a microcontroller. I picked the [Tessel](https://tessel.io/) because it runs simple JavaScript, easy to use, and powerful enough. It can create its own wifi network, where it runs a small web server, which will control the clock settings.

As it turned out, to drive the NeoPixels from the Tessel you either need custom firmware or treat the LED strip as a servo engine (sort of) and figure out the rest yourself. This wasn’t an option for me, but luckily Tim Pietrusky showed me a small piece of hardware, that was designed specifically to drive the NeoPixels: the [FadeCandy](https://www.adafruit.com/product/1689)

{% image_tag "pull-right" "fadecandy.jpg" "The FadeCandy Neopixel driver" %}

### FadeCandy

This tiny piece of board can control 512 LEDs on 8 channels (thats 64 LEDs per channel). It can be connected to any computer - even the Tessel - with USB and has a [well-documented protocol](https://github.com/scanlime/fadecandy/blob/master/doc/fc_protocol_usb.md). The nicest part with FadeCandy, that it can interpolate between the data frames. This means it’ll calculate the transitions between the data you send it, based on the frequency you update the data.

### Frame Circle

This will be the frame of the clock, on which the LEDs are glued, basically a circle of any material. This was surprisingly easy to get: [round embroidery wooden hoop](https://www.hobbycraft.co.uk/sewing/embroidery-and-cross-stitch/hoops-and-frames), 30cm (~12”) in diameter, but these are available in several sizes. Pick the one you’d like!

### Bezel

To cover the LEDs, a circular bezel should be glued to the frame. Not too narrow, because the LED’s omit some light sideways, and they can be visible and distracting. Also not too wide, because if it hides too much light from the LEDs, reading time can be problematic, not too precise.

The material of the bezel is also significant, he less translucent, the better. I made mine from several layers of fine white paper, and it's still letting some light through - which is not too nice.

## Assembly

<div class="video full"><video src="{% asset_path "qclock-assembly-720p.mp4" %}" autoplay loop title="Short video of the assembled clock frame">
</video></div>

First, I’ve wrapped the strip around and inside the wooden bezel so I could see how many LEDs are around the outer and the inner side of the frame - this will be the base of several further calculations.

{% image_tag "pull-right" "qclock-wiring.jpg" "Connecting the NeoPixel LED strips to the FadeCandy controller" %}

Turned out that there are 60 LEDs outside, and 58 inside. FadeCandy can control 64 LEDs per channel, so it’s not possible to handle the whole clock as one single strip. The simplest solution is to treat the outer and the inner circle as separate channels.

### Connecting to FadeCandy and power consumption

The NeoPixel strips have 3 ports on each end: GND, 5V, and DATA. For this size, the GND and the 5V on the two strips can be wired together. Above these, there is one data port for each strip, so a 4-wired cable is enough to connect the clock to the FadeCandy.

For larger setups, the LEDs use a lot of power, so usually, the 5V port is coming from a dedicated power supply with at least 2 Amperes. Luckily in our case, the power consumption is much lower. The FadeCandy has a small “hacker port” where the 3.3V point from the USB is accessible, so I tried to power the LEDs from that one, and it worked!

From this stage, connecting the FadeCandy to the Tessel is pretty easy, just connect a USB to Micro-USB cable to one of the Tessel’s USB ports. To make things a bit more sturdy, I packaged everything in an old ChromeCast box. This way I can put the clock controls to safety, minimizing the possibility of no accidental disconnection.

{% image_tag "full" "qclock-box.jpg" "QClock light test at night, lights behind the bezel, and all electronics in a small ChromeCast box. Looks really messy, but as a first, it's perfect!" %}

Stay tuned for the exciting second part, where I share some details of the software!

