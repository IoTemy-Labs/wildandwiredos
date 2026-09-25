// Wild & Wired OS page for KDE's Welcome Center (plasma-welcome loads every
// file in extra-pages/, in name order, before its closing page).
// Colours come from the active scheme, so the page follows WildWired.colors.
// Copy rules: second person, no em dashes, no exclamation marks, numerals.

import QtQuick
import QtQuick.Layouts
import QtQuick.Controls as QQC2
import org.kde.kirigami as Kirigami
import org.kde.plasma.welcome as Welcome

Welcome.Page {
    heading: "Start here"
    description: "3 things are worth knowing before you explore. The Field Guide has the rest, and it works without an internet connection."

    ColumnLayout {
        anchors.fill: parent
        spacing: Kirigami.Units.largeSpacing

        Repeater {
            model: [
                { label: "live session", title: "Trying it changes nothing",
                  body: "Until you install, nothing is written to your disk. Restarting puts the computer back the way it was, so save anything you want to keep to a USB stick." },
                { label: "install", title: "Keep it when you are ready",
                  body: "Double-click Install Wild & Wired OS on the desktop. It takes about 15 minutes. Back up your files first." },
                { label: "software", title: "Add apps with 1 click",
                  body: "Discover installs and updates apps for you. The next page lists apps picked for the festival." }
            ]
            delegate: Rectangle {
                required property var modelData
                Layout.fillWidth: true
                implicitHeight: card.implicitHeight + 2 * Kirigami.Units.largeSpacing
                radius: 6
                color: Kirigami.Theme.alternateBackgroundColor
                border.color: "#0f5f63"
                border.width: 1
                ColumnLayout {
                    id: card
                    anchors.fill: parent
                    anchors.margins: Kirigami.Units.largeSpacing
                    spacing: Kirigami.Units.smallSpacing
                    QQC2.Label {
                        text: modelData.label.toUpperCase()
                        color: Kirigami.Theme.linkColor
                        font.family: "JetBrains Mono"
                        font.weight: Font.Medium
                        font.pixelSize: 12
                        font.letterSpacing: 1.7
                    }
                    Kirigami.Heading {
                        level: 3
                        text: modelData.title
                        font.family: "Archivo"
                        font.weight: Font.DemiBold
                    }
                    QQC2.Label {
                        Layout.fillWidth: true
                        wrapMode: Text.WordWrap
                        text: modelData.body
                    }
                }
            }
        }

        RowLayout {
            spacing: Kirigami.Units.largeSpacing
            QQC2.Button {
                text: "Open the Field Guide"
                icon.name: "wildwired-logo"
                onClicked: Qt.openUrlExternally("file:///usr/share/wildwired/fieldguide.html")
            }
            QQC2.Button {
                text: "Visit wildandwiredwv.com"
                icon.name: "internet-web-browser"
                onClicked: Qt.openUrlExternally("https://wildandwiredwv.com/")
            }
        }

        Item { Layout.fillHeight: true }
    }
}
