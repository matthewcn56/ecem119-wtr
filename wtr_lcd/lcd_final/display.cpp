#include "display.h"

Display::Display(int rs, int enable, int d4, int d5, int d6, int d7) : lcd(rs, enable, d4, d5, d6, d7)
{
  lcd.begin(16, 2);
  lcd.clear();
}

String Display::getBottleVolume(const int &maxVol, const float &percent)
{
  String volume_str = "CurrVol: " + String(int(maxVol * percent)) + "mL";
  if (volume_str.length() >= 16)
  {
    volume_str = "CurrVol: Error!";
  }
  return volume_str;
}

String Display::getLastSipTime(const float &tsls)
{
  String time_str;
  int seconds = int(tsls / 1000);
  // Secs
  if (seconds < 60)
  {
    time_str = "TSLS: " + String(seconds) + " sec";
  }
  // Mins
  else if (seconds < 3600)
  {
    time_str = "TSLS: " + String(seconds / 60) + " min";
  }
  // Hours
  else if (seconds < 86400)
  {
    if (seconds / 3600 > 1)
    {
      time_str = "TSLS: " + String(seconds / 3600) + " hrs";
    }
    else
    {
      time_str = "TSLS: " + String(seconds / 3600) + " hr";
    }
  }
  // Days
  else if (seconds < 604800)
  {
    if (seconds / 86400 > 1)
    {
      time_str = "TSLS: " + String(seconds / 86400) + " days";
    }
    else
    {
      time_str = "TSLS: " + String(seconds / 86400) + " day";
    }
  }
  else
  {
    time_str = "DRINK NOW!";
  }

  return time_str;
}

void Display::printCode(const String &code)
{
  lcd.clear();
  lcd.print(code);
  delay(500);
}

void Display::printBottleData(const int &maxVol, const float &percent, const float &tsls)
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(this->getBottleVolume(maxVol, percent));
  lcd.setCursor(0, 1);
  lcd.print(this->getLastSipTime(tsls));
  delay(500);
}