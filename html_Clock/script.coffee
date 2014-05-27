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
    @element.style.position = 'relative'
    @element.style.top = (e.clientY - @offY) + 'px'
    @element.style.left = (e.clientX - @offX) + 'px'

class CanvasH
    context: null
    element: null
    container: null

    constructor: (@dimensions)->
        @container = document.getElementById("clock")
        @container.style.width = "#{@dimensions.width + 10}px";
        @container.style.height = "#{@dimensions.height + 10}px";
        dragger = new Drag
        dragger.init @container

    createClock: =>
        @element = document.createElement("canvas");
        @element.width = @dimensions.width
        @element.height = @dimensions.height
        @context = @element.getContext("2d")
        @container.appendChild @element

    bind: (eventName, listener)=>
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
        can.context.strokeStyle = @color;
        can.context.stroke()

class Needles extends ClockMaths
    value: 0
    origin: null
    radius: null
    angle: 0
    width: 1
    color: '#000000'

    events:
        minutePassed: "minutePassed"
        hourPassed: "hourPassed"

    trigger: (eventName)=>
        can.trigger eventName

    bind: (eventName, listener)=>
        can.bind eventName, listener

class Seconds extends Needles

    constructor: (@origin, @radius, @value = 0)->
        @angle -= @value * 6

    update: =>
        if @angle == -360
            @angle = 0
            @trigger @events.minutePassed
        @angle -= 6
        b = @CalculateSecondVertex @origin, @radius, @angle
        @drawLine @origin, b, @width

class Minutes extends Needles
    width: 3
    color: '#522900'

    constructor: (@origin, @radius, @value = 0)->
        @angle -= @value * 6
        @bind @events.minutePassed, @angleUpdate

    angleUpdate: =>
        @angle -= 6
        @trigger @events.hourPassed
    update: =>
        if @angle == -360
            @angle = 0
        b = @CalculateSecondVertex @origin, @radius, @angle
        @drawLine @origin, b, @width

class Hours extends Minutes

    width: 3
    color: '#295266'

    constructor: (@origin, @radius, @hourPassed, @minutePassed)->
        @angle -= ((@hourPassed % 12) * 30 + @minutePassed * 0.5)
        @bind @events.hourPassed, @angleUpdate

    angleUpdate: =>
        @angle -= 0.5

class window.Clock
    backGround : null
    ready: false
    needles: {}

    constructor: (@options = {})->
        if typeof(@options.dimensions) is "undefined"
            @options.dimensions = {height: 250, width: 250}
        else
            @options.dimensions = {height: @options.dimensions, width: @options.dimensions}
        if typeof(@options.needles) is "undefined"
            @options.needles = 
                minutes: 90
                hour: 70
                seconds: 100
        if typeof(@options.img) is "undefined"
            @options.img = "roman"
        @init()

    init: =>
        window.can = new CanvasH @options.dimensions
        can.createClock()
        @backGround = new Image
        @backGround.onload = @readyImage
        @backGround.src = @getImage()
        a = new Vertex @options.dimensions.height/2, @options.dimensions.width/2
        d = new Date
        @needles.seconds = new Seconds a, @options.needles.seconds, d.getSeconds()
        @needles.minutes = new Minutes a, @options.needles.minutes, d.getMinutes()
        @needles.hours = new Hours a, @options.needles.hour, d.getHours(), d.getMinutes()
        @update()
        setInterval @update, 1000

    getImage: =>
        switch @options.img
            when "numbers"
                return "res/numbers.jpg"
            when "numbers_b"
                return "res/number_bound.jpg"
            else
                return "res/roman_small.png"

    readyImage: =>
        @ready = true

    update: =>
        if @ready
            @clear()
            can.context.drawImage @backGround, 0, 0, @options.dimensions.height, @options.dimensions.width
            @needles.seconds.update()
            @needles.minutes.update()
            @needles.hours.update()

    clear: =>
        can.element.width = can.element.width;
    