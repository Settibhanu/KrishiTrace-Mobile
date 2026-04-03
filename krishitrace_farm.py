"""
╔══════════════════════════════════════════════════════════════╗
║  KRISHITRACE  —  Smart Farm 3D Simulation                    ║
║  AI + Blockchain + IoT Agricultural Monitoring               ║
╠══════════════════════════════════════════════════════════════╣
║  INSTALL (one time):                                         ║
║    pip install pygame PyOpenGL PyOpenGL_accelerate           ║
║                                                              ║
║  RUN:                                                        ║
║    python krishitrace_farm.py                                ║
╚══════════════════════════════════════════════════════════════╝
"""
# pyre-ignore-all-errors
# type: ignore

import sys, math, random, time, array

try:
    import pygame
    from pygame.locals import *
except ImportError:
    sys.exit("ERROR: Run  →  pip install pygame PyOpenGL PyOpenGL_accelerate")

try:
    from OpenGL.GL   import *
    from OpenGL.GLU  import *
except ImportError:
    sys.exit("ERROR: Run  →  pip install PyOpenGL PyOpenGL_accelerate")

# ── constants ───────────────────────────────────────────────────────────────
W, H          = 1280, 760
FPS           = 60
TITLE         = "KrishiTrace Farm OS  v3.5 - Advanced Realism Update"
FOG_DENSITY   = 0.015

SKY_DAY   = (0.39, 0.62, 0.90)
SKY_DUSK  = (0.86, 0.39, 0.20)
SKY_NIGHT = (0.04, 0.06, 0.14)
TOD_CYCLE = ["day","dusk","night"]

# ── camera state ─────────────────────────────────────────────────────────────
cam = {
    "theta" : 0.7,   "phi"   : 0.52,
    "radius": 45.0,  "cx"    : 0.0,
    "cy"    : 2.0,   "cz"    : 0.0,
    "auto"  : True,
}
drag   = {"left": False, "right": False, "lx": 0, "ly": 0}
tod    = ["day"]
fog_on = [True]

# ── sensor / metric state ────────────────────────────────────────────────────
metrics = {
    "temperature"  : 26.4, "humidity"     : 71.0, "soil_moisture": 58.0,
    "soil_ph"      :  6.8, "crop_health"  : 92.0, "wind_speed"   : 12.3,
    "lux"          : 42800.0, "blocks"    : 2847,
}

ALERTS = [
    "Tomato harvest ready  Zone 3",
    "AI Parsed: '50kg rice payout Rs30'",
    "Blockchain: 3 supply-chain tags verified",
    "Sell onions now  Mandi price +12%",
    "pH stable across all IoT nodes",
    "Farmers active  EN / HI / TE / KA",
    "Shipment #KT-2847 dispatched",
    "Soil moisture optimal  Rows 4-7",
]
alert_state = {"idx": 0, "text": ALERTS[0], "timer": 0.0}
last_metric = [0.0]
hovered_sensor = None
alarm_state = {"active": False, "timer": 0.0}
beep_sound = None
blip_sound = None

random.seed(42)

# ════════════════════════════════════════════════════════════════════════════
#  AUDIO ENGINE
# ════════════════════════════════════════════════════════════════════════════
def create_beep_sound(frequency=600, duration_ms=400, volume=0.5):
    # Mixer already initialized by pygame.init()
    sample_rate = pygame.mixer.get_init()[0] if pygame.mixer.get_init() else 44100
    n_samples = int(sample_rate * (duration_ms / 1000.0))
    buf = array.array('h')
    for i in range(n_samples):
        mod = 1.0 if (i % (sample_rate//5)) < (sample_rate//10) else 0.0
        val = int(volume * 32767.0 * mod * math.sin(2 * math.pi * frequency * i / sample_rate))
        buf.append(val); buf.append(val)
    return pygame.mixer.Sound(buffer=buf)

def create_blip_sound(frequency=800, duration_ms=150, volume=0.6):
    sample_rate = pygame.mixer.get_init()[0] if pygame.mixer.get_init() else 44100
    n_samples = int(sample_rate * (duration_ms / 1000.0))
    buf = array.array('h')
    for i in range(n_samples):
        mod = 1.0 - (i / n_samples)
        wave = math.sin(2 * math.pi * frequency * i / sample_rate) + 0.5 * math.sin(2 * math.pi * frequency * 1.5 * i / sample_rate)
        val = int(volume * 32767.0 * mod * wave * 0.6)
        if val > 32767: val = 32767
        if val < -32768: val = -32768
        buf.append(val); buf.append(val)
    return pygame.mixer.Sound(buffer=buf)

# ════════════════════════════════════════════════════════════════════════════
#  LOW-LEVEL DRAW PRIMITIVES
# ════════════════════════════════════════════════════════════════════════════

def gl_color(c): glColor4f(*c)

def draw_box(x, y, z, w, h, d, col):
    hw, hh, hd = w/2, h/2, d/2
    verts = [
        (x-hw,y-hh,z+hd),(x+hw,y-hh,z+hd),(x+hw,y+hh,z+hd),(x-hw,y+hh,z+hd),
        (x-hw,y-hh,z-hd),(x-hw,y+hh,z-hd),(x+hw,y+hh,z-hd),(x+hw,y-hh,z-hd),
        (x-hw,y+hh,z-hd),(x-hw,y+hh,z+hd),(x+hw,y+hh,z+hd),(x+hw,y+hh,z-hd),
        (x-hw,y-hh,z-hd),(x+hw,y-hh,z-hd),(x+hw,y-hh,z+hd),(x-hw,y-hh,z+hd),
        (x+hw,y-hh,z-hd),(x+hw,y+hh,z-hd),(x+hw,y+hh,z+hd),(x+hw,y-hh,z+hd),
        (x-hw,y-hh,z-hd),(x-hw,y-hh,z+hd),(x-hw,y+hh,z+hd),(x-hw,y+hh,z-hd),
    ]
    normals = [(0,0,1),(0,0,-1),(0,1,0),(0,-1,0),(1,0,0),(-1,0,0)]
    glColor4f(*col); glBegin(GL_QUADS)
    for f in range(6):
        glNormal3f(*normals[f])
        for i in range(4): glVertex3f(*verts[f*4+i])
    glEnd()

def draw_cylinder(x, y, z, r1, r2, height, col, segs=8, rx=0, rz=0):
    glPushMatrix(); glTranslatef(x, y, z); glRotatef(rx, 1, 0, 0); glRotatef(rz, 0, 0, 1); glColor4f(*col)
    half = height / 2
    glBegin(GL_QUAD_STRIP)
    for i in range(segs + 1):
        a = 2 * math.pi * i / segs; cx, cz = math.cos(a), math.sin(a)
        glNormal3f(cx, 0, cz)
        glVertex3f(cx * r1, -half, cz * r1)
        glVertex3f(cx * r2,  half, cz * r2)
    glEnd()
    for sign, r_eff in [(-1, r1), (1, r2)]:
        glBegin(GL_TRIANGLE_FAN); glNormal3f(0, sign, 0); glVertex3f(0, sign * half, 0)
        rng = range(segs + 1) if sign == 1 else range(segs, -1, -1)
        for i in rng:
            a = 2 * math.pi * i / segs; glVertex3f(math.cos(a) * r_eff, sign * half, math.sin(a) * r_eff)
        glEnd()
    glPopMatrix()

def draw_sphere(x, y, z, r, col, stacks=6, slices=6):
    glPushMatrix(); glTranslatef(x, y, z); glColor4f(*col)
    for i in range(stacks):
        lat0 = math.pi * (-0.5 + i / stacks); lat1 = math.pi * (-0.5 + (i+1) / stacks)
        z0, zr0 = math.sin(lat0), math.cos(lat0); z1, zr1 = math.sin(lat1), math.cos(lat1)
        glBegin(GL_QUAD_STRIP)
        for j in range(slices + 1):
            lng = 2 * math.pi * j / slices; x0, y0 = math.cos(lng), math.sin(lng)
            glNormal3f(x0*zr0, z0, y0*zr0); glVertex3f(x0*zr0*r, z0*r, y0*zr0*r)
            glNormal3f(x0*zr1, z1, y0*zr1); glVertex3f(x0*zr1*r, z1*r, y0*zr1*r)
        glEnd()
    glPopMatrix()

def draw_torus(x, y, z, R, r, col, segs=16, tube_segs=8):
    glPushMatrix(); glTranslatef(x, y, z); glColor4f(*col)
    for i in range(segs):
        a0 = 2 * math.pi * i / segs; a1 = 2 * math.pi * (i+1) / segs
        glBegin(GL_QUAD_STRIP)
        for j in range(tube_segs + 1):
            b = 2 * math.pi * j / tube_segs
            for a in (a0, a1):
                nx, ny, nz = math.cos(a)*math.cos(b), math.sin(b), math.sin(a)*math.cos(b)
                vx, vy, vz = (R+r*math.cos(b))*math.cos(a), r*math.sin(b), (R+r*math.cos(b))*math.sin(a)
                glNormal3f(nx, ny, nz); glVertex3f(vx, vy, vz)
        glEnd()
    glPopMatrix()

def draw_plane_textured(size, col, subdivs=40):
    step = size * 2 / subdivs
    glColor4f(*col); glBegin(GL_QUADS); glNormal3f(0, 1, 0)
    for i in range(subdivs):
        for j in range(subdivs):
            x0 = -size + i * step; z0 = -size + j * step
            v = 0.9 + 0.1 * ((i + j) % 2)
            glColor4f(col[0]*v, col[1]*v, col[2]*v, 1.0)
            glVertex3f(x0, 0, z0); glVertex3f(x0+step, 0, z0); glVertex3f(x0+step, 0, z0+step); glVertex3f(x0, 0, z0+step)
    glEnd()

# ════════════════════════════════════════════════════════════════════════════
#  REALISTIC CROPS (Procedurally generated shapes)
# ════════════════════════════════════════════════════════════════════════════

CROPS = []
# Zones: tomato, wheat, cabbage
ZONES_DEF = [
    (range(-18,-7,3), range(-18,-7,3), "tomato", (0.1, 0.4, 0.1, 1)),
    (range( 8, 19,1), range(-18,-7,1), "wheat",  (0.8, 0.7, 0.2, 1)),
    (range(-18,-7,2), range( 8, 19,2), "cabbage",(0.4, 0.7, 0.3, 1)),
    (range( 8, 19,3), range( 8, 19,3), "tomato", (0.1, 0.4, 0.1, 1)),
]
for xr, zr, ctype, cc in ZONES_DEF:
    for xi in xr:
        for zi in zr:
            h = 1.2 if ctype=="tomato" else 0.8 if ctype=="wheat" else 0.4
            ro = random.uniform(0, 360)
            CROPS.append((xi + random.uniform(-0.1,0.1), zi + random.uniform(-0.1,0.1), h, ctype, ro))

def render_plant(cx2, cz2, ch, ctype, r_offset, sway):
    glPushMatrix(); glTranslatef(cx2, 0, cz2); glRotatef(sway * 45 + r_offset, 0, 1, 0)
    
    if ctype == "tomato":
        # Draw wooden stake
        draw_cylinder(0, ch/2, 0, 0.02, 0.02, ch+0.2, (0.5, 0.4, 0.2, 1), segs=4)
        # Draw main green stalk wrapping around
        draw_cylinder(0.02, ch/2 - 0.1, 0.02, 0.03, 0.01, ch, (0.2, 0.5, 0.2, 1), segs=4)
        # Branches and leaves
        num_branches = 5
        for i in range(num_branches):
            bh = ch * (0.3 + 0.7 * (i/num_branches))
            glPushMatrix(); glTranslatef(0, bh, 0)
            ba = i * 137.5
            glRotatef(ba, 0, 1, 0); glRotatef(40, 1, 0, 0)
            # Branch stalk
            draw_cylinder(0, 0.15, 0, 0.015, 0.005, 0.3, (0.2, 0.5, 0.2, 1), segs=3)
            # Leaf quad
            glPushMatrix(); glTranslatef(0, 0.3, 0); glRotatef(30, 1, 0, 0)
            draw_box(0, 0.0, 0, 0.2, 0.02, 0.2, (0.1, 0.4, 0.1, 1))
            glPopMatrix()
            # Tomato fruit (red)
            if i % 2 == 0: # 50% chance of fruit
                draw_sphere(0.0, 0.1, -0.05, 0.07, (0.8, 0.1, 0.1, 1), stacks=4, slices=5)
            glPopMatrix()
            
    elif ctype == "wheat":
        # Group of 3 swaying golden stalks
        for w_i in range(3):
            glPushMatrix()
            rx, rz = math.cos(w_i*120)*0.08, math.sin(w_i*120)*0.08
            glTranslatef(rx, 0, rz)
            # Bend physics
            glRotatef(sway * 60, 0, 0, 1)
            # Straw stalk
            draw_cylinder(0, ch/2, 0, 0.01, 0.005, ch, (0.8, 0.7, 0.3, 1), segs=3)
            # Grain head (thickened top)
            draw_cylinder(0, ch, 0, 0.025, 0.01, 0.2, (0.9, 0.8, 0.2, 1), segs=4)
            glPopMatrix()

    elif ctype == "cabbage":
        # Leafy green heads, overlapping shells
        draw_sphere(0, 0.2, 0, 0.2, (0.5, 0.8, 0.4, 1), stacks=5, slices=6)
        for i in range(4):
            glPushMatrix(); glTranslatef(0, 0.2, 0)
            glRotatef(i * 90 + r_offset, 0, 1, 0)
            glRotatef(20, 1, 0, 0)
            draw_box(0, 0.1, 0.15, 0.25, 0.25, 0.03, (0.3, 0.6, 0.3, 1))
            glPopMatrix()

    glPopMatrix()


# ════════════════════════════════════════════════════════════════════════════
#  ANIMATED ANIMALS (Fully articulated)
# ════════════════════════════════════════════════════════════════════════════

class Animal:
    def __init__(self, typ):
        self.type = typ
        a = random.uniform(0, math.pi*2)
        d = random.uniform(35, 60)
        self.x, self.z = math.cos(a)*d, math.sin(a)*d
        self.tx, self.tz = self.x, self.z
        self.speed = 2.0 if typ in ['crane','crow'] else (1.2 if typ == 'cow' else 0.8)
        self.fleeing = False
        self.leg_phase = random.uniform(0, 10)

    def update(self, dt):
        dx, dz = self.tx - self.x, self.tz - self.z
        dst = math.hypot(dx, dz)
        if dst < 1.0:
            if self.fleeing:
                if math.hypot(self.x, self.z) > 40: self.fleeing = False
            else:
                a = random.uniform(0, math.pi*2)
                d = random.uniform(18, 50)
                self.tx, self.tz = math.cos(a)*d, math.sin(a)*d
        else:
            move = self.speed * dt * (3.0 if self.fleeing else 1.0)
            actual_move = min(move, dst)
            self.x += (dx/dst) * actual_move
            self.z += (dz/dst) * actual_move
            self.leg_phase += actual_move * 5.0 # animate legs based on movement scale
    
    def draw(self, t):
        glPushMatrix(); glTranslatef(self.x, 0, self.z)
        angle = math.degrees(math.atan2(-self.tx + self.x, self.tz - self.z))
        glRotatef(angle, 0, 1, 0)
        
        lp = self.leg_phase
        walk_sway = math.sin(lp) * 20
        bounce = abs(math.sin(lp*2)) * 0.1

        if self.type == 'cow':
            glTranslatef(0, 0.7 + bounce, 0)
            bl, br = (0.8,0.8,0.8,1), (0.1,0.1,0.1,1)
            # body
            draw_box(0, 0, 0, 0.6, 0.5, 1.2, bl)
            draw_box(0, -0.2, 0, 0.2, 0.15, 0.4, (0.9,0.7,0.7,1)) # udder
            # head
            draw_box(0, 0.4, 0.6, 0.35, 0.35, 0.4, br)
            draw_cylinder(0.2, 0.6, 0.7, 0.04, 0.02, 0.3, (0.9,0.9,0.8,1), rx=30) # horns
            draw_cylinder(-0.2, 0.6, 0.7, 0.04, 0.02, 0.3, (0.9,0.9,0.8,1), rx=30)
            # swinging tail
            glPushMatrix(); glTranslatef(0, 0.1, -0.6); glRotatef(math.cos(t*4)*30, 0, 0, 1); draw_cylinder(0, -0.3, 0, 0.02, 0.02, 0.6, br); glPopMatrix()
            # 4 moving legs
            for lx, lz, phase_mod in [(-0.25, 0.4, 1), (0.25, 0.4, -1), (-0.25, -0.4, -1), (0.25, -0.4, 1)]:
                glPushMatrix(); glTranslatef(lx, -0.25, lz)
                glRotatef(math.sin(lp + phase_mod*math.pi/2) * 25, 1, 0, 0)
                draw_box(0, -0.3, 0, 0.15, 0.6, 0.15, br)
                glPopMatrix()

        elif self.type == 'elephant':
            glTranslatef(0, 1.4 + bounce*1.5, 0)
            ec = (0.45,0.45,0.5,1)
            # body
            draw_box(0, 0, 0, 1.4, 1.3, 2.0, ec)
            # head
            glPushMatrix(); glTranslatef(0, 0.4, 1.0)
            draw_box(0, 0, 0, 1.0, 1.0, 1.0, ec)
            # flipping ears
            ear_flap = abs(math.sin(t*3))*20
            glPushMatrix(); glTranslatef(0.5, 0, -0.2); glRotatef(-ear_flap, 0, 1, 0); draw_box(0.5, 0, 0, 1.0, 1.0, 0.1, ec); glPopMatrix()
            glPushMatrix(); glTranslatef(-0.5, 0, -0.2); glRotatef(ear_flap, 0, 1, 0); draw_box(-0.5, 0, 0, 1.0, 1.0, 0.1, ec); glPopMatrix()
            # curling trunk
            trunk_curl = math.sin(t*2)*20 + 20
            glPushMatrix(); glTranslatef(0, -0.3, 0.5); glRotatef(-trunk_curl, 1, 0, 0); draw_cylinder(0, -0.5, 0, 0.2, 0.1, 1.2, ec, rx=0); glPopMatrix()
            # tusks
            draw_cylinder(0.3, -0.2, 0.6, 0.06, 0.02, 0.6, (1,1,0.9,1), rx=70, rz=20)
            draw_cylinder(-0.3, -0.2, 0.6, 0.06, 0.02, 0.6, (1,1,0.9,1), rx=70, rz=-20)
            glPopMatrix()
            # 4 moving enormous legs
            for lx, lz, phase_mod in [(-0.5, 0.7, 1), (0.5, 0.7, -1), (-0.5, -0.7, -1), (0.5, -0.7, 1)]:
                glPushMatrix(); glTranslatef(lx, -0.65, lz)
                glRotatef(math.sin(lp/1.5 + phase_mod*math.pi/2) * 20, 1, 0, 0)
                draw_cylinder(0, -0.6, 0, 0.25, 0.25, 1.2, ec)
                glPopMatrix()

        else: # crane / crow (birds)
            glTranslatef(0, 0.8 + bounce, 0)
            c = (0.9,0.9,0.9,1) if self.type == 'crane' else (0.1,0.1,0.1,1)
            # body
            draw_box(0, 0, 0, 0.25, 0.3, 0.5, c)
            # neck & head
            draw_cylinder(0, 0.3, 0.2, 0.04, 0.04, 0.5, c, rx=45)
            draw_box(0, 0.6, 0.35, 0.15, 0.15, 0.2, c)
            draw_cylinder(0, 0.6, 0.5, 0.03, 0.01, 0.3, (0.8,0.6,0.1,1), rx=90) # beak
            # flapping wings
            flap = math.sin(lp * 3.0) * 45 if self.fleeing else math.sin(t) * 5
            glPushMatrix(); glTranslatef(0.12, 0.1, 0); glRotatef(-flap, 0, 0, 1); draw_box(0.2, 0, 0, 0.4, 0.05, 0.4, c); glPopMatrix()
            glPushMatrix(); glTranslatef(-0.12, 0.1, 0); glRotatef(flap, 0, 0, 1); draw_box(-0.2, 0, 0, 0.4, 0.05, 0.4, c); glPopMatrix()
            # 2 stick legs
            for lx, phase_mod in [(-0.1, 1), (0.1, -1)]:
                glPushMatrix(); glTranslatef(lx, -0.15, 0)
                glRotatef(math.sin(lp + phase_mod*math.pi/2) * 50, 1, 0, 0)
                draw_cylinder(0, -0.4, 0, 0.02, 0.02, 0.8, (0.8,0.6,0.1,1))
                glPopMatrix()

        glPopMatrix()

animals = [Animal(random.choice(['cow','cow','elephant','crane','crow','crow'])) for _ in range(12)]

interactables = []

def project_3d_to_2d(x, y, z):
    modelview = glGetDoublev(GL_MODELVIEW_MATRIX)
    projection = glGetDoublev(GL_PROJECTION_MATRIX)
    viewport = glGetIntegerv(GL_VIEWPORT)
    try:
        sx, sy, sz = gluProject(x, y, z, modelview, projection, viewport)
        return int(sx), int(viewport[3] - sy), sz
    except:
        return -1, -1, 1

def define_sensor(x, y, z, sid, text):
    interactables.append({"id": sid, "pos": (x,y,z), "text": text})

def draw_scene(t, mx, my):
    global interactables
    interactables = []
    wind = metrics["wind_speed"]
    sway = math.sin(t * 1.4) * (wind / 60.0) * 0.12

    # Ground & Paths
    draw_plane_textured(35, (0.15, 0.35, 0.14, 1))
    for z in [-6, 0, 6]: draw_box(0, 0.01, z, 70, 0.01, 1.1, (0.28, 0.19, 0.10, 1))
    for x in [-6, 0, 6]: draw_box(x, 0.01, 0, 1.1, 0.01, 70, (0.28, 0.19, 0.10, 1))

    # Crops using realistic layered renderer
    for (cx2, cz2, ch, ctype, r_off) in CROPS:
        render_plant(cx2, cz2, ch, ctype, r_off, sway)

    # Fence & Live Ultrasonic nodes
    FENCE_HALF = 22
    post_c = (0.55, 0.41, 0.08, 1); rail_c = (0.62, 0.47, 0.10, 1); gate_c = (0.83, 0.63, 0.09, 1)
    us_col = (0.8, 0.8, 0.8, 1.0)
    for xp in range(-FENCE_HALF, FENCE_HALF+1, 2):
        for side in [-FENCE_HALF, FENCE_HALF]:
            draw_cylinder(xp, 0.9, side, 0.05, 0.05, 1.8, post_c, segs=6)
            draw_cylinder(side, 0.9, xp, 0.05, 0.05, 1.8, post_c, segs=6)
            if xp % 4 == 0:
                # Dynamic ultrasonic hover calc
                draw_box(xp, 1.8, side + (0.05 if side>0 else -0.05), 0.15, 0.15, 0.05, us_col)
                draw_box(side + (0.05 if side>0 else -0.05), 1.8, xp, 0.05, 0.15, 0.15, us_col)
                
                # Pre-calculate nearest animal distance for the hover text
                min_dst = 999.0
                for a in animals:
                    d = math.hypot(a.x - xp, a.z - side)
                    if d < min_dst: min_dst = d
                txt = f"Ultrasonic Array (Active)\nDistance to nearest target: {min_dst:.1f}m"
                define_sensor(xp, 1.8, side, "us1", txt)
                define_sensor(side, 1.8, xp, "us1", txt)

    span = FENCE_HALF * 2
    for yp in [0.5, 1.1]:
        draw_box(0, yp, -FENCE_HALF, span, 0.07, 0.07, rail_c); draw_box(0, yp,  FENCE_HALF, span, 0.07, 0.07, rail_c)
        draw_box(-FENCE_HALF, yp, 0, 0.07, 0.07, span, rail_c); draw_box( FENCE_HALF, yp, 0, 0.07, 0.07, span, rail_c)
    for gx in [-1.1, 1.1]: draw_cylinder(gx, 1.0, -FENCE_HALF, 0.08, 0.08, 2.0, gate_c, segs=6)

    # ── Central Tower
    steel, glass, dark = (0.16, 0.25, 0.43, 1), (0.12, 0.43, 0.67, 0.75), (0.07, 0.12, 0.23, 1)
    draw_cylinder(0, 0.22, 0, 1.6, 1.6, 0.44, (0.09, 0.15, 0.31, 1), segs=8)
    draw_box(0, 1.8, 0, 2.4, 1.2, 2.4, (0.09, 0.14, 0.27, 1))
    
    # Tower ESP32 + DHT11
    draw_box(-1.25, 2.0, 0.0, 0.1, 0.4, 0.4, (0.1,0.1,0.1,1))
    define_sensor(-1.3, 2.0, 0.0, "esp32", "Agri-Hub ESP32 Core\nProcesses & syncs blockchain telemetry")
    draw_box(-1.25, 1.6, 0.5, 0.05, 0.2, 0.15, (0.2,0.6,0.8,1))
    define_sensor(-1.3, 1.6, 0.5, "dht11", f"DHT11 Environment Sensor\nTemp: {metrics['temperature']:.1f}°C | Hum: {metrics['humidity']:.1f}%")

    for angle in [0, 90, 180, 270]:
        a = math.radians(angle)
        glPushMatrix(); glTranslatef(math.cos(a)*1.21, 1.8, math.sin(a)*1.21); glRotatef(-angle, 0, 1, 0)
        draw_box(0, 0, 0, 0.06, 0.55, 0.75, glass); glPopMatrix()

    # main shaft & top
    draw_cylinder(0, 4.5, 0, 0.55, 0.55, 6.0, steel, segs=10)
    pulse_g = int(210 + 45 * math.sin(t * 1.5))
    ring_col = (0.0, pulse_g/255, pulse_g*0.7/255, 1)
    if alarm_state["active"]: ring_col = (1.0, 0.0, 0.0, 1.0) # Flash Red
    for yp in [2.8, 3.8, 4.8, 5.8]:
        draw_torus(0, yp, 0, 0.65, 0.05, ring_col, segs=14, tube_segs=6)
    
    draw_sphere(0, 7.2, 0, 0.95, dark, stacks=6, slices=10)
    draw_torus(0, 7.2, 0, 0.95, 0.07, ring_col, segs=16, tube_segs=5)
    draw_cylinder(0, 9.0, 0, 0.05, 0.05, 3.5, (0.6, 0.65, 0.68, 1), segs=6)
    
    blink_c = (1.0, 0.0, 0.0, 1) if alarm_state["active"] or (math.sin(t*5)>0) else (0.2,0,0,1)
    draw_sphere(0, 10.7, 0, 0.14, blink_c, stacks=5, slices=8)

    # Render Animals
    for a in animals: a.draw(t)

# ════════════════════════════════════════════════════════════════════════════
#  2D HUD OVERLAY
# ════════════════════════════════════════════════════════════════════════════

def fluctuate(val, base, lo, hi, step):
    val += random.uniform(-step, step)
    return max(lo, min(hi, val * 0.96 + base * 0.04))

def update_metrics():
    m = metrics
    m["temperature"]   = fluctuate(m["temperature"],   26.0, 18, 42,  0.3)
    m["humidity"]      = fluctuate(m["humidity"],       71.0, 30,100,  0.5)
    m["soil_moisture"] = fluctuate(m["soil_moisture"],  58.0, 20, 95,  0.4)
    m["soil_ph"]       = fluctuate(m["soil_ph"],         6.8, 5.5,8.0,0.04)
    m["crop_health"]   = fluctuate(m["crop_health"],    92.0, 60,100,  0.2)
    m["wind_speed"]    = fluctuate(m["wind_speed"],     12.0,  0, 60,  0.6)
    m["lux"]           = fluctuate(m["lux"],         42000.0,  0,80000,400)
    m["blocks"]       += random.randint(0, 2)

def draw_hud(surface, fonts, t):
    W2, H2 = surface.get_size()
    surface.fill((0, 0, 0, 0))

    fnt_s, fnt_m, fnt_b = fonts["small"], fonts["med"], fonts["big"]
    C_BG, C_ACT, C_HEAD, C_MUT = (10,20,42,210), (0,200,150), (200,240,210), (90,150,120)

    def panel(rx, ry, rw, rh, col=C_BG):
        s = pygame.Surface((rw, rh), pygame.SRCALPHA); s.fill(col)
        pygame.draw.rect(s, C_ACT + (120,), (0,0,rw,rh), 1); surface.blit(s, (rx, ry))

    def label(text, x, y, col=C_HEAD, font=None):
        surface.blit((font or fnt_s).render(text, True, col), (x, y))

    def bar(x, y, w, h2, pct, col):
        bg = pygame.Surface((w, h2), pygame.SRCALPHA); bg.fill((30, 50, 40, 160)); surface.blit(bg, (x, y))
        fw = int(w * min(1.0, max(0.0, pct)))
        if fw > 0: fb = pygame.Surface((fw, h2), pygame.SRCALPHA); fb.fill(col + (220,)); surface.blit(fb, (x, y))

    # Header
    panel(0, 0, W2, 32, (8, 16, 36, 220))
    header = f"  ◉ KRISHITRACE FARM OS  v3.5    BLOCKCHAIN: {metrics['blocks']:,}    MODE: {tod[0].upper()}    ALARM: {'ON' if alarm_state['active'] else 'STBY'}"
    label(header, 8, 8, C_HEAD, fnt_s)

    # Right metrics
    PW, PH = 230, 340; PX = W2 - PW - 10; PY = 40
    panel(PX, PY, PW, PH)
    label("  LIVE SENSOR DATA", PX+6, PY+6, C_ACT, fnt_m)
    pygame.draw.line(surface, C_ACT, (PX, PY+24), (PX+PW, PY+24), 1)

    metric_rows = [
        ("TEMPERATURE",   f"{metrics['temperature']:.1f} °C", metrics['temperature'], 18, 42,  (255,130, 50)),
        ("HUMIDITY",      f"{metrics['humidity']:.1f} %",     metrics['humidity'],    30,100,  ( 56,189,248)),
        ("SOIL MOISTURE", f"{metrics['soil_moisture']:.1f} %",metrics['soil_moisture'],20,95,  (163,230, 53)),
        ("CROP HEALTH",   f"{metrics['crop_health']:.1f} %",  metrics['crop_health'],  60,100, ( 34,197, 94)),
    ]
    for i, (name, val_str, val_raw, lo, hi, col) in enumerate(metric_rows):
        oy = PY + 32 + i * 43
        label(name, PX+8, oy, C_MUT, fnt_s); label(val_str, PX+8, oy+14, C_HEAD, fnt_m)
        bar(PX+8, oy+30, PW-16, 5, (val_raw - lo) / max(1, hi - lo), col)

    # Alert ticker
    if alarm_state["active"]:
        panel(8, H2-54, 420, 22, (200, 30, 30, 195))
        label(f"  ⚠  ANIMAL INTRUSION DETECTED! ALARM ACTIVE.", 12, H2-50, (255,255,255), fnt_m)
    else:
        panel(8, H2-54, 420, 22, (0, 50, 30, 195))
        label(f"  ▶  {alert_state['text']}", 12, H2-50, (160,255,190), fnt_s)

    # Active hover tooltips (draw closest only based on valid projection)
    if hovered_sensor:
        lines = hovered_sensor["text"].split("\n")
        hh = len(lines) * 16 + 12
        hx, hy = hovered_sensor["px"] + 10, hovered_sensor["py"] - hh - 10
        # keep on screen
        if hx + 300 > W2: hx = W2 - 305
        if hy < 40: hy = 40
        panel(hx, hy, 300, hh, (0, 20, 50, 240))
        for i, ln in enumerate(lines):
            label(ln, hx+8, hy+6+i*16, (100,255,150) if i==0 else (200,200,200), fnt_m if i==0 else fnt_s)


hud_tex_id = [None]
def init_hud_texture():
    hud_tex_id[0] = glGenTextures(1)
    glBindTexture(GL_TEXTURE_2D, hud_tex_id[0])
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR)
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR)

def upload_hud_texture(surface):
    glBindTexture(GL_TEXTURE_2D, hud_tex_id[0])
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, W, H, 0, GL_RGBA, GL_UNSIGNED_BYTE, pygame.image.tostring(surface, "RGBA", True))

def draw_hud_quad():
    glDisable(GL_LIGHTING); glDisable(GL_DEPTH_TEST); glEnable(GL_TEXTURE_2D)
    glBindTexture(GL_TEXTURE_2D, hud_tex_id[0]); glColor4f(1, 1, 1, 1)
    glMatrixMode(GL_PROJECTION); glPushMatrix(); glLoadIdentity(); glOrtho(0, W, 0, H, -1, 1)
    glMatrixMode(GL_MODELVIEW); glPushMatrix(); glLoadIdentity()
    glBegin(GL_QUADS)
    glTexCoord2f(0,0); glVertex2f(0, 0); glTexCoord2f(1,0); glVertex2f(W, 0)
    glTexCoord2f(1,1); glVertex2f(W, H); glTexCoord2f(0,1); glVertex2f(0, H)
    glEnd()
    glPopMatrix(); glMatrixMode(GL_PROJECTION); glPopMatrix()
    glMatrixMode(GL_MODELVIEW); glDisable(GL_TEXTURE_2D); glEnable(GL_DEPTH_TEST); glEnable(GL_LIGHTING)

# ════════════════════════════════════════════════════════════════════════════
#  MAIN ENTRY
# ════════════════════════════════════════════════════════════════════════════

def main():
    global hovered_sensor, beep_sound, blip_sound
    pygame.init()
    screen = pygame.display.set_mode((W, H), DOUBLEBUF | OPENGL | HWSURFACE)
    pygame.display.set_caption(TITLE)
    
    glEnable(GL_DEPTH_TEST); glEnable(GL_BLEND); glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA); glEnable(GL_NORMALIZE)
    glEnable(GL_LIGHTING); glEnable(GL_LIGHT0); glEnable(GL_LIGHT1)
    glLightfv(GL_LIGHT0, GL_POSITION, [15.0, 25.0, 10.0, 0.0])
    glLightfv(GL_LIGHT1, GL_POSITION, [-10.0, 8.0, -8.0, 0.0])
    glLightfv(GL_LIGHT1, GL_DIFFUSE, [0.15, 0.20, 0.40, 1.0])
    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, [0.3, 0.3, 0.3, 1.0]); glMaterialf (GL_FRONT_AND_BACK, GL_SHININESS, 32.0)
    glColorMaterial(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE); glEnable(GL_COLOR_MATERIAL)
    glMatrixMode(GL_PROJECTION); glLoadIdentity(); gluPerspective(55, W/H, 0.5, 300); glMatrixMode(GL_MODELVIEW)

    init_hud_texture()

    try: 
        beep_sound = create_beep_sound()
        blip_sound = create_blip_sound()
    except Exception as e: print("Sound init failed:", e)

    hud_surf = pygame.Surface((W, H), pygame.SRCALPHA)
    fonts = {
        "small": pygame.font.SysFont("Consolas,monospace", 13),
        "med"  : pygame.font.SysFont("Consolas,monospace", 14, bold=True),
        "big"  : pygame.font.SysFont("Consolas,monospace", 18, bold=True),
    }

    clock = pygame.time.Clock(); start_t = time.time(); frame = 0

    while True:
        dt = clock.tick(FPS) / 1000.0; now = time.time() - start_t
        mx, my = pygame.mouse.get_pos()

        for event in pygame.event.get():
            if event.type == QUIT or (event.type == KEYDOWN and event.key == K_ESCAPE):
                pygame.quit(); sys.exit()
            if event.type == KEYDOWN:
                if event.key == K_n:
                    tod[0] = TOD_CYCLE[(TOD_CYCLE.index(tod[0])+1) % len(TOD_CYCLE)]
                if event.key == K_SPACE: cam["auto"] = not cam["auto"]
            if event.type == MOUSEBUTTONDOWN:
                if event.button == 1: drag["left"] = True; drag["lx"], drag["ly"] = event.pos; cam["auto"] = False
                if event.button == 3: drag["right"] = True; drag["lx"], drag["ly"] = event.pos
            if event.type == MOUSEBUTTONUP:
                if event.button == 1: drag["left"] = False
                if event.button == 3: drag["right"] = False
            if event.type == MOUSEMOTION:
                dx, dy = event.pos[0] - drag["lx"], event.pos[1] - drag["ly"]
                drag["lx"], drag["ly"] = event.pos
                if drag["left"]:
                    cam["theta"] -= dx * 0.007; cam["phi"] = max(0.08, min(1.48, cam["phi"] - dy * 0.005))
                if drag["right"]:
                    t2 = cam["theta"]
                    cam["cx"] -= (math.cos(t2)*dx - math.sin(t2)*dy) * 0.04
                    cam["cz"] += (math.sin(t2)*dx + math.cos(t2)*dy) * 0.04
            if event.type == MOUSEWHEEL:
                cam["radius"] = max(8.0, min(80.0, cam["radius"] - event.y * 2.5))

        if cam["auto"]: cam["theta"] += 0.004

        if now - last_metric[0] > 2.0: update_metrics(); last_metric[0] = now
        alert_state["timer"] += dt
        if alert_state["timer"] > 5.5:
            alert_state["timer"] = 0.0; alert_state["idx"] = (alert_state["idx"] + 1) % len(ALERTS)
            alert_state["text"] = ALERTS[alert_state["idx"]]
            if blip_sound: blip_sound.play()

        # Update Animals & Defense System
        is_breached = False
        for a in animals:
            a.update(dt)
            dist = math.hypot(a.x, a.z)
            if dist < 24.5 and not a.fleeing:
                a.fleeing = True
                a.tx, a.tz = a.x * 2.5, a.z * 2.5
                is_breached = True
        
        if is_breached:
            alarm_state["active"] = True; alarm_state["timer"] = 3.0
            if beep_sound: beep_sound.play()
        if alarm_state["active"]:
            alarm_state["timer"] -= dt
            if alarm_state["timer"] <= 0: alarm_state["active"] = False

        # Apply lighting
        t_cycle = tod[0]
        if t_cycle == "day":
            glLightfv(GL_LIGHT0, GL_DIFFUSE, [1.0, 0.96, 0.82, 1.0]); glLightfv(GL_LIGHT0, GL_AMBIENT, [0.22, 0.30, 0.40, 1.0])
        elif t_cycle == "dusk":
            glLightfv(GL_LIGHT0, GL_DIFFUSE, [1.0, 0.55, 0.24, 1.0]); glLightfv(GL_LIGHT0, GL_AMBIENT, [0.30, 0.20, 0.22, 1.0])
        else:
            glLightfv(GL_LIGHT0, GL_DIFFUSE, [0.08, 0.12, 0.32, 1.0]); glLightfv(GL_LIGHT0, GL_AMBIENT, [0.04, 0.06, 0.16, 1.0])

        # 3D Render
        sky = SKY_DAY if t_cycle=="day" else SKY_DUSK if t_cycle=="dusk" else SKY_NIGHT
        glClearColor(*sky, 1.0); glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        r, th, ph = cam["radius"], cam["theta"], cam["phi"]
        ex = cam["cx"] + r * math.sin(ph) * math.sin(th); ey = cam["cy"] + r * math.cos(ph); ez = cam["cz"] + r * math.sin(ph) * math.cos(th)
        glLoadIdentity(); gluLookAt(ex, ey, ez, cam["cx"], cam["cy"], cam["cz"], 0, 1, 0)
        
        draw_scene(now, mx, my)

        # Hover Check (closest hit)
        hovered_sensor = None
        closest_z = 2.0
        for s in interactables:
            px, py, pz = project_3d_to_2d(*s["pos"])
            if 0 < pz < 1.0 and math.hypot(mx - px, my - py) < 35:
                if pz < closest_z:
                    closest_z = pz
                    hovered_sensor = s
                    hovered_sensor["px"] = px
                    hovered_sensor["py"] = py

        draw_hud(hud_surf, fonts, now)
        upload_hud_texture(hud_surf)
        draw_hud_quad()

        pygame.display.flip(); frame += 1

if __name__ == "__main__":
    main()
