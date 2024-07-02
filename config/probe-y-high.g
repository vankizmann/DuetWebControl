; probe-y-high.g

G21 G91                     ; relative movement
G10 L20 P0 Y0               ; set zero position (rrf bug)
M558 F200                   ; Set high feedrate
G38.2 Y-20                  ; loose probe
G10 L20 P0 Y0               ; set zero position (rrf bug)
M558 F50                    ; Set low feedrate
G0 Y1 F100                  ; move 1mm
G38.2 Y-2                   ; precise probe
G10 L20 P0 Y{param.R}       ; set z position
G0 Y5 F100                  ; move 5mm
