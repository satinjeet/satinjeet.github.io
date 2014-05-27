class Drag
  offX: null
  offY: null

  init: (@element) =>
    @element.addEventListener 'mousedown', @mouseDown, false
    window.addEventListener 'mouseup', @mouseUp, false

  mouseUp: =>
    window.removeEventListener 'mousemove', @move, true

  mouseDown: (e)=>
    @offY = e.clientY - parseInt @element.offsetTop
    @offX = e.clientX - parseInt @element.offsetLeft
    window.addEventListener 'mousemove', @move, true

  move: (e)=>
    @element.style.position = 'absolute'
    @element.style.top = (e.clientY - @offY) + 'px'
    @element.style.left = (e.clientX - @offX) + 'px'

class CanvasH
    context: null
    element: null
    events:
        m: "minutePassed"
        h: "hourPassed"

    constructor: ->
        @element = document.getElementById("myCanvas")
        @context = @element.getContext("2d")
        dragger = new Drag
        dragger.init @element

    on: (eventName, listener)=>
        @element.addEventListener eventName, listener

    trigger: (eventName)->
        if (document.createEvent)
            event = document.createEvent("HTMLEvents");
            event.initEvent(eventName, true, true);
        else
            event = document.createEventObject();
            event.eventType = eventName;
        event.eventName = eventName;
        if (document.createEvent)
            @element.dispatchEvent event
        else
            @element.fireEvent "on"+event.eventType, event

class Vertex
    x: 0
    y: 0
    constructor: (@x = 0, @y = 0)->

class ClockMaths

    CalculateSecondVertex: (start, hypotanuse, theta)->
        t = new Vertex
        dx = hypotanuse * Math.sin (theta*Math.PI)/180
        dy = hypotanuse * Math.cos (theta*Math.PI)/180
        t.x = start.x - dx
        t.y = start.y - dy
        return t

    drawLine: (start, end, width = 1)->
        can.context.lineWidth = width
        can.context.beginPath()
        can.context.moveTo(start.x, start.y)
        can.context.lineTo(end.x, end.y)
        can.context.stroke()

class Needles extends ClockMaths
    value: 0
    origin: null
    radius: null
    angle: 0
    width: 1

class Seconds extends Needles

    constructor: (@origin, @radius, @value = 0)->
        @angle -= @value * 6

    update: =>
        if @angle == -360
            @angle = 0
            can.trigger can.events.m
        @angle -= 6
        b = @CalculateSecondVertex @origin, @radius, @angle
        @drawLine a, b, @width

class Minutes extends Needles
    width: 3

    constructor: (@origin, @radius, @value = 0)->
        @angle -= @value * 6
        can.on can.events.m, @angleUpdate

    angleUpdate: =>
        @angle -= 6
        can.trigger can.events.h
    update: =>
        if @angle == -360
            @angle = 0
        b = @CalculateSecondVertex @origin, @radius, @angle
        @drawLine a, b, @width

class Hours extends Minutes

    width: 3

    constructor: (@origin, @radius, @hourPassed, @minutePassed)->
        @angle -= ((@hourPassed % 12) * 30 + @minutePassed * 0.5)
        can.on can.events.h, @angleUpdate

    angleUpdate: =>
        @angle -= 0.5

class Clock
    backGround : null
    ready: false

    constructor: ->
        @backGround = new Image
        @backGround.onload = @readyImage
        @backGround.src = "res/roman.png"

    readyImage: =>
        @ready = true

    update: =>
        if @ready
            can.context.drawImage @backGround, 0, 0, 250, 250

initCanvas = ->
    window.can = new CanvasH

update = ->
    can.element.width = can.element.width;
    clock.update()
    seconds.update()
    minutes.update()
    hours.update()

window.addEventListener 'load', ->
    initCanvas()
    
    window.a = new Vertex 125, 125
    d = new Date
    window.seconds = new Seconds a, 100, d.getSeconds()
    window.minutes = new Minutes a, 100, d.getMinutes()
    window.hours = new Hours a, 70, d.getHours(), d.getMinutes()
    window.clock = new Clock
    
    update()

    setInterval(update, 1000);