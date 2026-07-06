#include <iostream>
#include <iomanip>
#include <vector>
#include <string>
#include <limits>
#include <fstream>

using namespace std;


void POwO_vector_BinaryInsert(vector<string>& inVector , string inString , bool inUseLength)
{
    if (inVector.size() == 0)
    {
        inVector.push_back(inString);
    }
    else
    {
        int PinL = 0;
        int PinR = (int)inVector.size();
        bool willInsert = true;

        while (PinL < PinR)
        {
            int PinM = PinL + (PinR - PinL) / 2;
            cout << "LMR:" << PinL << "," << PinM << "," << PinR << endl;

            //base on lenth first
            if (inVector[PinM].length() < inString.length() && inUseLength)
            {
                PinL = PinM + 1;
            }
            else if (inString.length() < inVector[PinM].length() && inUseLength)
            {
               PinR = PinM ;
            }
            else if (inVector[PinM] < inString) //then string
            {
                PinL = PinM + 1;
            }
            else if (inString < inVector[PinM])
            {
                PinR = PinM;
            }
            else if (inVector[PinM].length() == inString.length() && inVector[PinM] == inString)
            {
                //found match
                PinL = PinM;
                PinR = PinM;
                willInsert = false;
            }
        }

        if (willInsert)
        {
            inVector.insert(inVector.begin() + PinL, inString);
        }
        
    }
    
}

int main ()
{
    vector<string> StringList = {};
    string USERinput = "";

    getline(cin,USERinput);

    while(USERinput != "/exit")
    {
        cout << ">";
        //cin.ignore();
        getline(cin,USERinput);

        if (USERinput == "/help" || USERinput == "/h")
        {
            cout << "/print all, /clr, /read doc, /print doc, /del" << endl;
        }
        else if (USERinput == "/print all")
        {
            for(int i = 0 ; i < StringList.size() ; i++)
            {
                cout << "(" << i << ")" << StringList[i] << endl;
            }
        }
        else if (USERinput == "/clr")
        {
            #ifdef _WIN32
                system("cls");
            #else
                system("clear");
            #endif
        }
        else if (USERinput == "/read doc")
        {
            cout << "filename ? : ";
            string temp_fileName = "";
            getline(cin,temp_fileName);
            cout << "is ordered ? y/n :";
            string temp_isOrdered = "";
            getline(cin,temp_isOrdered);

            ifstream ReaderOwO(temp_fileName);

            if (!ReaderOwO.is_open())
            {
                cout << "nope, can't find file QwQ>" << endl;
            }
            else
            {
                string temp_line = "";

                if (temp_isOrdered == "y")
                {
                    while( getline(ReaderOwO, temp_line))
                    {
                        StringList.push_back(temp_line);
                    }
                }
                else
                {
                    while( getline(ReaderOwO, temp_line))
                    {
                        POwO_vector_BinaryInsert(StringList, temp_line, false);
                    }
                }

                
            }
        }
        else if (USERinput == "/print doc")
        {
            cout << "filename ? : ";
            string temp_fileName = "";
            getline(cin,temp_fileName);

            ofstream WriterOwO(temp_fileName);
            if (!WriterOwO.is_open())
            {
                cout << "can't write file QAQ" << endl;
            }
            else
            {
                for(int i = 0 ; i < StringList.size() ; i ++)
                {
                    WriterOwO << StringList[i] << "\n";
                }
            }
            WriterOwO.close();
        }
        else if (USERinput == "/del")
        {
            int temp_catchIndex = -1;
            cout << "index ? : " ;
            cin >> temp_catchIndex;
            cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // 🔥 ONLY HERE
            if (0 <= temp_catchIndex && temp_catchIndex < StringList.size())
            {
                StringList.erase( StringList.begin() + temp_catchIndex );
                cout << "removed item index : " << temp_catchIndex << endl; 
            }
            else
            {
                cout << "index out of range" << endl;
            }
        }
        else if (USERinput.at(0) == '/')
        {
            cout << "unrecognized command" << endl;
        }
        else
        {
            POwO_vector_BinaryInsert(StringList, USERinput, false);
        }
    }
    
}