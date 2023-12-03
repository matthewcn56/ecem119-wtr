#include "display.h"

Display::Display(int rs, int enable, int d4, int d5, int d6, int d7) : lcd(rs, enable, d4, d5, d6, d7) {
  lcd.begin(16, 2);
  lcd.clear();
}

void Display::printData(const String& data) {
  lcd.clear();
  lcd.print(data);
  delay(500);
}