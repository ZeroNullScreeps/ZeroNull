module.exports = {
    primary: function(message, title = false) {
        let messageTitle = title || "Heads Up!";
        console.log(`<font color=#1266F1>[${title}]:</font> ${message}`);
    },
    secondary: function(message, title = false) {
        let messageTitle = title || "Heads Up!";
        console.log(`<font color=#B23CFD>[${title}]:</font> ${message}`);
    },
    success: function(message, title = false) {
        let messageTitle = title || "Success";
        console.log(`<font color=#00B74A>[${title}]:</font> ${message}`);
    },
    danger: function(message, title = false) {
        let messageTitle = title || "Error";
        console.log(`<font color=#F93154>[${title}]:</font> ${message}`);
    },
    warning: function(message, title = false) {
        let messageTitle = title || "Warning";
        console.log(`<font color=#FFA900>[${title}]:</font> ${message}`);
    },
    info: function(message, title = false) {
        let messageTitle = title || "Info";
        console.log(`<font color=#39C0ED>[${title}]:</font> ${message}`);
    },
    light: function(message, title = false) {
        let messageTitle = title || "Heads Up!";
        console.log(`<font color=#FBFBFB>[${title}]:</font> ${message}`);
    },
    dark: function(message, title = false) {
        let messageTitle = title || "Heads Up!";
        console.log(`<font color=#262626>[${title}]:</font> ${message}`);
    },
}