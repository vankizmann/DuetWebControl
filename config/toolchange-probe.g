; toolchange-probe.g

G21 G90                                     ; absolute positioning
G53 G0 Z0                                   ; move to machine z zero
G53 G0 X595 Y-235                           ; go to probing position

G21 G91                                     ; relative movement
M558 F340                                   ; Set high feedrate
G38.2 Z-200                                 ; loose probe z

; Safe loose zero position
var firstLoosePosition = move.axes[2].userPosition;

G10 L20 P0 Z0                               ; set zero position (rrf bug)
G0 Z1                                       ; move z up 1mm
M558 F50                                    ; Set low feedrate
G38.2 Z-2                                   ; precise probe z

; Safe precise zero position
var firstToolPosition = var.firstLoosePosition - move.axes[2].userPosition;

G10 L20 P0 Z{var.firstToolPosition}         ; set tool position
G0 Z10 F100                                 ; move 10mm up

; move to parking position
M98 P"cnc/toolchange-park.g"

; create modal and wait for confirmation
M291 P"Change your tool now, accept when done" S2

G21 G90                                     ; absolute positioning
G53 G0 Z0                                   ; move to machine z zero
G53 G0 X595 Y-235                           ; go to probing position

G21 G91                                     ; relative movement
M558 F340                                   ; Set high feedrate
G38.2 Z-200                                 ; loose probe z

; Safe loose zero position
var nextLoosePosition = move.axes[2].userPosition;

G10 L20 P0 Z0                               ; set zero position (rrf bug)
G0 Z1                                       ; move z up 1mm
M558 F50                                    ; Set low feedrate
G38.2 Z-2                                   ; precise probe z

; Safe precise zero position
var nextToolPosition = var.nextLoosePosition - move.axes[2].userPosition;

; Calculate tooloffset
var toolchangeOffset = var.firstToolPosition - var.nextToolPosition;

; Set final offset
G10 L20 P0 Z{var.firstToolPosition}

; move 10mm up
G0 Z10 F100

echo "Tooloffset: " ^ var.toolchangeOffset ^ "mm"