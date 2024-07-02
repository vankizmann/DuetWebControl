; probe-z-plate.g

G21 G91                 ; relative movement
G10 L20 P0 Z0           ; set zero position (rrf bug)
M558 F200               ; Set high feedrate
G38.2 Z-20              ; loose probe z
G10 L20 P0 Z0           ; set zero position (rrf bug)
M558 F50                ; Set low feedrate
G0 Z1 F100              ; move 1mm
G38.2 Z-2               ; precise probe z
G10 L20 P0 Z5.8         ; set z position
G0 Z10 F100             ; move 10mm
