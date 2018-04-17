const Ryu = {
    attack: function() {
        console.log('攻击')
    },
    defense: function() {
        console.log('防御')
    },
    jump: function() {
        console.log('跳跃')
    },
    crouch: function() {
        console.log('蹲下')
    },
}

const makeCommand = function(receiver, state) {
    return function() {
        reseiver[state]()
    }
}

const commands = {
    '119': 'jump', // W
    '115': 'crouch', // S
    '97': 'defense', // A
    '100': 'attack', // D
}

const commandStack = []

document.onpress = function(ev) {
    const keyCode = ev.keyCode
    command = mackCommand(Ryu, commands[keyCode])

    if(command) {
        command()
        commandStack.push(command)
    }
}

document.getElementById('replay').onclick = function() {
    const command
    while(command = commandStack.shift()) {
        command
    }
}




