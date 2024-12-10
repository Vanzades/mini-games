import pygame
import math
import random
import sys

# Inisialisasi pygame
pygame.init()

# Konfigurasi layar
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Angry Birds Clone")

# Warna
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# Kecepatan frame
clock = pygame.time.Clock()
FPS = 60

# Objek burung
bird_radius = 15
bird_x, bird_y = 100, HEIGHT - 100
bird_color = RED

# Status burung
bird_launched = False
bird_speed = 0
bird_angle = 0
bird_vx = 0
bird_vy = 0

# Objek target (kotak hijau)
target_width, target_height = 40, 40
target_x = random.randint(400, WIDTH - target_width)
target_y = random.randint(HEIGHT // 2, HEIGHT - target_height - 50)

# Level
level = 1

# Skor
score = 0
font = pygame.font.Font(None, 36)

# Fungsi peluncuran
def launch_bird():
    global bird_launched, bird_vx, bird_vy
    bird_launched = True
    bird_vx = bird_speed * math.cos(bird_angle)
    bird_vy = -bird_speed * math.sin(bird_angle)

# Fungsi reset level
def reset_level():
    global bird_x, bird_y, bird_launched, target_x, target_y, bird_vx, bird_vy, bird_speed, bird_angle
    bird_x, bird_y = 100, HEIGHT - 100
    bird_launched = False
    bird_vx = 0
    bird_vy = 0
    bird_speed = 0
    bird_angle = 0
    target_x = random.randint(400, WIDTH - target_width)
    target_y = random.randint(HEIGHT // 2, HEIGHT - target_height - 50)

# Game loop
running = True
while running:
    screen.fill(WHITE)

    # Event loop
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN and not bird_launched:
            # Tentukan kecepatan dan sudut berdasarkan posisi mouse
            mouse_x, mouse_y = pygame.mouse.get_pos()
            dx = mouse_x - bird_x
            dy = mouse_y - bird_y
            bird_speed = min(math.sqrt(dx ** 2 + dy ** 2) / 10, 15)  # Batas kecepatan
            bird_angle = math.atan2(-dy, dx)
        elif event.type == pygame.MOUSEBUTTONUP and not bird_launched:
            # Luncurkan burung
            launch_bird()

    # Update posisi burung
    if bird_launched:
        bird_x += bird_vx
        bird_y += bird_vy
        bird_vy += 0.5  # Gravitasi

        # Periksa jika burung keluar dari layar
        if bird_x < 0 or bird_x > WIDTH or bird_y > HEIGHT:
            reset_level()

        # Periksa tabrakan dengan target
        if (target_x < bird_x < target_x + target_width) and (
            target_y < bird_y < target_y + target_height
        ):
            score += 10
            level += 1
            reset_level()

    # Gambar target
    pygame.draw.rect(screen, GREEN, (target_x, target_y, target_width, target_height))

    # Gambar burung
    pygame.draw.circle(screen, bird_color, (int(bird_x), int(bird_y)), bird_radius)

    # Gambar skor dan level
    score_text = font.render(f"Score: {score}", True, BLACK)
    level_text = font.render(f"Level: {level}", True, BLACK)
    screen.blit(score_text, (10, 10))
    screen.blit(level_text, (10, 50))

    # Perbarui layar
    pygame.display.flip()
    clock.tick(FPS)

# Tutup pygame
pygame.quit()
sys.exit()
