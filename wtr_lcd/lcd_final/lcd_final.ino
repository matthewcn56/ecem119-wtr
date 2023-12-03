#include "display.h"

Display display(25, 12, 14, 26, 27, 13);

void setup() {
  Serial.begin(9600);
}

void loop() {
  String s = "Your mom";
  display.printData(s);
}
