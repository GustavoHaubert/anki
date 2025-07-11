from PyQt6.QtWidgets import QWidget, QPushButton, QVBoxLayout, QApplication, QSizePolicy
from PyQt6.QtGui import QGuiApplication
import sys

class MainWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Main Window")

        self.button = QPushButton("Click here and some other text")

        self.button.setSizePolicy(
            QSizePolicy.Policy.Expanding,
            QSizePolicy.Policy.Fixed
        )


        layout = QVBoxLayout()
        layout.addWidget(self.button, stretch=1)
        self.setLayout(layout)
        self.setMinimumWidth(400)

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()