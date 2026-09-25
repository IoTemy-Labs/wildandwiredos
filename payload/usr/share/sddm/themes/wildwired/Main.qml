// Wild & Wired OS login screen (SDDM, Qt 6), direction 1A.
// Spec: frontend-design handoff, "Shared: SDDM login". Authored at
// 1920x1080 and scaled by k. The sponsor band (y 880 to 1008) is painted
// into the background image by render-sponsors.py; this file draws the
// centred column and the footer bar, and never enters the band.
// Copy rules: second person, no em dashes, no exclamation marks.

import QtQuick

Rectangle {
    id: root
    width: 1920
    height: 1080
    color: base

    readonly property real k: Math.min(width / 1920, height / 1080)

    // Handoff tokens. Structure teal never carries text.
    readonly property color base: "#073e45"
    readonly property color elev: "#0a4f58"
    readonly property color well: "#03252a"
    readonly property color body: "#d6e9e7"
    readonly property color secondary: "#8fb3b2"
    readonly property color mint: "#40dfaf"
    readonly property color focusRing: "#8cefd0"
    readonly property color structure: "#12837b"
    readonly property color subtle: "#0f5f63"
    readonly property color attention: "#ffffff"

    readonly property string display: "Archivo"
    readonly property string ui: "Source Sans 3"
    readonly property string mono: "JetBrains Mono"

    property int userIndex: userModel.lastIndex >= 0 ? userModel.lastIndex : 0
    property int sessionIndex: sessionModel.lastIndex >= 0 ? sessionModel.lastIndex : 0
    property string loginError: ""

    // Role readers: SDDM exposes users and sessions as list models.
    ListView {
        id: users
        model: userModel
        currentIndex: root.userIndex
        width: 1; height: 100; opacity: 0; interactive: false; enabled: false
        delegate: Item {
            width: 1; height: 1
            property string uName: model.name
            property string uReal: model.realName
            property bool uNeedsPassword: model.needsPassword
        }
    }
    ListView {
        id: sessions
        model: sessionModel
        currentIndex: root.sessionIndex
        width: 1; height: 100; opacity: 0; interactive: false; enabled: false
        delegate: Item { width: 1; height: 1; property string sName: model.name }
    }

    readonly property string userName: users.currentItem ? users.currentItem.uName : ""
    readonly property string realName: users.currentItem && users.currentItem.uReal !== ""
                                       ? users.currentItem.uReal : userName
    readonly property bool needsPassword: users.currentItem ? users.currentItem.uNeedsPassword : true
    readonly property string sessionName: sessions.currentItem ? sessions.currentItem.sName : ""

    function initials(n) {
        var parts = n.trim().split(/\s+/)
        var s = parts[0] ? parts[0].charAt(0) : "?"
        if (parts.length > 1) s += parts[parts.length - 1].charAt(0)
        return s.toUpperCase()
    }
    function tracked(px) { return 0.14 * px }   // .14em label tracking
    function doLogin() {
        root.loginError = ""
        sddm.login(root.userName, password.text, root.sessionIndex)
    }
    function nextUser(step) {
        if (users.count < 2) return
        root.userIndex = (root.userIndex + step + users.count) % users.count
        password.text = ""
    }

    Connections {
        target: sddm
        function onLoginFailed() {
            root.loginError = "That password did not match. Check caps lock, then try again."
            password.text = ""
            password.forceActiveFocus()
        }
    }

    Image {
        anchors.fill: parent
        source: config.background
        fillMode: Image.PreserveAspectCrop
        asynchronous: false
    }

    // --- Centred column, 480 wide, kept above the sponsor band -----------
    Column {
        id: column
        width: 480 * k
        anchors.horizontalCenter: parent.horizontalCenter
        y: Math.max(32 * k, (880 * k - height) / 2)
        spacing: 0

        Image {
            anchors.horizontalCenter: parent.horizontalCenter
            source: config.lockup
            width: 476 * k
            height: width * sourceSize.height / Math.max(1, sourceSize.width)
            fillMode: Image.PreserveAspectFit
            smooth: true
        }
        Item { width: 1; height: 14 * k }
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: String(config.version).toUpperCase()
            color: mint
            font.family: mono; font.weight: 500; font.pixelSize: 20 * k
            font.letterSpacing: tracked(20 * k)
        }
        Item { width: 1; height: 44 * k }

        Rectangle {
            anchors.horizontalCenter: parent.horizontalCenter
            width: 104 * k; height: width; radius: width / 2
            color: elev
            border.color: structure; border.width: 2
            Text {
                anchors.centerIn: parent
                text: initials(realName)
                color: mint
                font.family: display; font.weight: 700; font.pixelSize: 40 * k
            }
        }
        Item { width: 1; height: 16 * k }
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            elide: Text.ElideRight
            text: realName
            color: attention
            font.family: display; font.weight: 600; font.pixelSize: 34 * k
        }
        Item { width: 1; height: 6 * k }
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: users.count > 1 ? "up and down to change user".toUpperCase() : sessionName.toUpperCase()
            color: secondary
            font.family: mono; font.weight: 500; font.pixelSize: 15 * k
            font.letterSpacing: tracked(15 * k)
        }
        Item { width: 1; height: 28 * k }

        // Password field: focus is two rings, a base gap then #8cefd0.
        Rectangle {
            id: ring
            width: parent.width + 8 * k; height: 64 * k + 8 * k
            anchors.horizontalCenter: parent.horizontalCenter
            radius: 8 * k
            color: "transparent"
            border.color: password.activeFocus ? focusRing : "transparent"
            border.width: 2 * k
            Rectangle {
                id: field
                anchors.centerIn: parent
                width: column.width; height: 64 * k
                radius: 4 * k
                color: well
                border.color: loginError !== "" ? attention : structure
                border.width: 1
                Rectangle {   // well inset: inset 0 1px 0 rgba(3,37,42,.5)
                    x: 1; y: 1; width: parent.width - 2; height: 1
                    color: Qt.rgba(3 / 255, 37 / 255, 42 / 255, 0.5)
                }
                // Lock glyph, 22px, drawn from rectangles (no icon theme needed).
                Item {
                    id: lock
                    x: 20 * k; anchors.verticalCenter: parent.verticalCenter
                    width: 22 * k; height: 22 * k
                    Rectangle {
                        width: 12 * k; height: 11 * k; radius: 6 * k
                        x: 5 * k; y: 0
                        color: "transparent"; border.color: secondary; border.width: 2 * k
                    }
                    Rectangle {
                        width: 18 * k; height: 12 * k; radius: 2 * k
                        x: 2 * k; y: 9 * k; color: secondary
                    }
                }
                TextInput {
                    id: password
                    anchors.left: lock.right; anchors.leftMargin: 14 * k
                    anchors.right: enterHint.left; anchors.rightMargin: 14 * k
                    anchors.verticalCenter: parent.verticalCenter
                    echoMode: TextInput.Password
                    passwordCharacter: "•"
                    color: body
                    font.family: ui; font.pixelSize: 22 * k
                    clip: true
                    focus: true
                    Keys.onReturnPressed: doLogin()
                    Keys.onEnterPressed: doLogin()
                    Keys.onUpPressed: nextUser(-1)
                    Keys.onDownPressed: nextUser(1)
                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        visible: password.text === ""
                        text: needsPassword ? "Password" : "No password needed"
                        color: secondary
                        font.family: ui; font.pixelSize: 22 * k
                    }
                }
                Text {
                    id: enterHint
                    anchors.right: parent.right; anchors.rightMargin: 20 * k
                    anchors.verticalCenter: parent.verticalCenter
                    text: "ENTER"
                    color: secondary
                    font.family: mono; font.weight: 500; font.pixelSize: 15 * k
                    font.letterSpacing: tracked(15 * k)
                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: doLogin() }
                }
            }
        }
        Item { width: 1; height: 18 * k }

        // Attention state: white ink, white outline, !! sigil, never red.
        Rectangle {
            visible: loginError !== ""
            anchors.horizontalCenter: parent.horizontalCenter
            width: parent.width; height: visible ? errText.implicitHeight + 20 * k : 0
            color: well; radius: 4 * k
            border.color: attention; border.width: 1
            Text {
                id: errText
                anchors.fill: parent; anchors.margins: 10 * k
                verticalAlignment: Text.AlignVCenter
                wrapMode: Text.WordWrap
                text: "!!  " + loginError
                color: attention
                font.family: ui; font.pixelSize: 18 * k
            }
        }
        Item { width: 1; height: loginError !== "" ? 14 * k : 0 }
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            wrapMode: Text.WordWrap
            text: needsPassword ? "Type your password, then press enter."
                                : "Nothing is written to disk. Press enter to explore."
            color: body
            font.family: ui; font.pixelSize: 20 * k
        }
    }

    // --- Footer bar: 72px well, #0f5f63 top rule ---------------------------
    Rectangle {
        id: footer
        anchors.left: parent.left; anchors.right: parent.right; anchors.bottom: parent.bottom
        height: 72 * k
        color: well
        Rectangle { width: parent.width; height: 1; color: subtle }

        component FooterLabel: Text {
            color: secondary
            font.family: mono; font.weight: 500; font.pixelSize: 16 * k
            font.letterSpacing: tracked(16 * k)
            verticalAlignment: Text.AlignVCenter
        }
        component FooterButton: Rectangle {
            id: btn
            property alias label: t.text
            property bool attentionStyle: false
            signal activated()
            height: 40 * k
            width: t.implicitWidth + 28 * k
            radius: 4 * k
            color: attentionStyle ? Qt.rgba(1, 1, 1, 0.10)
                                  : (ma.containsMouse ? "#0d6068" : "transparent")
            border.width: attentionStyle || ma.containsMouse ? 1 : 0
            border.color: attentionStyle ? attention : "#1a9d93"
            FooterLabel {
                id: t
                anchors.centerIn: parent
                color: btn.attentionStyle ? attention : secondary
            }
            MouseArea { id: ma; anchors.fill: parent; hoverEnabled: true; onClicked: btn.activated() }
        }

        FooterLabel {
            anchors.left: parent.left; anchors.leftMargin: 32 * k
            anchors.verticalCenter: parent.verticalCenter
            text: (String(config.product) + "  /  " + sddm.hostName).toUpperCase()
        }
        Row {
            anchors.right: parent.right; anchors.rightMargin: 32 * k
            anchors.verticalCenter: parent.verticalCenter
            spacing: 16 * k
            FooterButton {
                visible: sessions.count > 1
                label: sessionName.toUpperCase()
                onActivated: root.sessionIndex = (root.sessionIndex + 1) % sessions.count
            }
            FooterButton {
                visible: typeof keyboard !== "undefined" && keyboard.layouts.length > 1
                label: visible ? String(keyboard.layouts[keyboard.currentLayout].shortName).toUpperCase() : ""
                onActivated: keyboard.currentLayout = (keyboard.currentLayout + 1) % keyboard.layouts.length
            }
            FooterButton {
                visible: sddm.canReboot
                label: "RESTART"
                onActivated: sddm.reboot()
            }
            FooterButton {
                visible: sddm.canPowerOff
                label: "SHUT DOWN"
                attentionStyle: true
                onActivated: sddm.powerOff()
            }
        }
    }

    Component.onCompleted: password.forceActiveFocus()
}
