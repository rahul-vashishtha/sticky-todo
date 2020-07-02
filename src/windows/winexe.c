/*
 * File: winexe.c
 * Project: sticky-todo
 * File Created: Tuesday, 9th June 2020 11:27:50 am
 * Copyright : © 2020 Rinnegan Technologies Pvt. Ltd.
 */

/*
 * ONLY FOR WINDOWS
 * Compile using Visual C++: 
 * rc version.rc
 * cl winexe.c version.res /Fe"Sticky-ToDo"
 */

#define _WIN32_WINNT_0x0500

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <windows.h>

#pragma comment(lib, "user32.lib")

int main()
{
    ShowWindow(GetConsoleWindow(), SW_HIDE);
    WinExec("./qode.exe", SW_HIDE);
    // return system("qode.exe");
}