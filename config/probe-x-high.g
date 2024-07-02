; probe-x-high.g

G21 G91                     ; relative movement
G10 L20 P0 X0               ; set zero position (rrf bug)
M558 F200                   ; Set high feedrate
G38.2 X-20                  ; loose probe
G10 L20 P0 X0               ; set zero position (rrf bug)
M558 F50                    ; Set low feedrate
G0 X1 F100                  ; move 1mm
G38.2 X-2                   ; precise probe
G10 L20 P0 X{param.R}       ; set z position
G0 X5 F100                  ; move 5mm
