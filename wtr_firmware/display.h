#ifndef DISPLAY_H
#define DISPLAY_H

#include <Arduino.h>
#include <LiquidCrystal.h>

class Display
{
public:
  Display(int rs, int enable, int d4, int d5, int d6, int d7);
  String getBottleVolume(const int &maxVol, const float &percent);
  String getLastSipTime(const float &tsls);

  void printCode(const String &code);
  void printBottleData(const int &maxVol, const float &percent, const float &tsls);

private:
  LiquidCrystal lcd;
};

#endif