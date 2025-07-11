import pytest
from PyQt6.QtWidgets import QApplication, QWidget, QPushButton
from PyQt6.QtGui import QFontMetrics
import sys

@pytest.fixture
def app():
    return QApplication(sys.argv)

def test_main_window_exists(app):
    from main import MainWindow 

    window = MainWindow()
    assert isinstance(window, QWidget)

def test_main_window_has_button(app):
    from main import MainWindow

    window = MainWindow()
    assert hasattr(window, "button"), "MainWindow should have a 'button' attribute"
    assert isinstance(window.button, QPushButton), "button should be a QPushButton"

def test_button_text_not_cut_off(app):
    from main import MainWindow

    window = MainWindow()
    button = window.button

    font_metrics = QFontMetrics(button.font())
    text_width = font_metrics.horizontalAdvance(button.text())

    assert button.width() >= text_width, (
        f"Text cut off in Qt buttons: width={button.width()} < text width={text_width}"
    )
