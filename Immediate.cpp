#include <iostream>
#include <iomanip>
#include <vector>
#include <string>
#include <limits>
#include <fstream>

using namespace std;

int main ()
{
    ifstream ReaderOwO("Dictionary.txt");
    ofstream WriterOwO("Dictionary2.txt");

    char temp_char;
    while(ReaderOwO.get(temp_char))
    {
        if (temp_char == ' '){ WriterOwO << "\n"; } else {WriterOwO << temp_char;}
    }

    cout << "done" << endl;
}