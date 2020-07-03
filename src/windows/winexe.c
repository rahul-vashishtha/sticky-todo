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
    STARTUPINFO si;
    PROCESS_INFORMATION pi;

    ZeroMemory(&si, sizeof(si));
    si.cb = sizeof(si);
    ZeroMemory(&pi, sizeof(pi));

    ShowWindow(GetConsoleWindow(), SW_HIDE);

    CreateProcess("./qode.exe", "", NULL, // Process handle not inheritable
                  NULL,                   // Thread handle not inheritable
                  FALSE,                  // Set handle inheritance to FALSE
                  0,                      // No creation flags
                  NULL,                   // Use parent's environment block
                  NULL,                   // Use parent's starting directory
                  &si,                    // Pointer to STARTUPINFO structure
                  &pi);

    return 0;
}