#ifndef DISPLAY_H
#define DISPLAY_H

#include <Arduino.h>
#include <LiquidCrystal.h>

class Display {
public:
  Display(int rs, int enable, int d4, int d5, int d6, int d7);
  void printData(const String& data);

private:
  LiquidCrystal lcd;
};

#endif