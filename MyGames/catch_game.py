import pygame
import random
import sys

# Inisialisasi pygame
pygame.init()

# Konfigurasi layar
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Catch the Falling Objects")

# Warna
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)

# Kecepatan frame
clock = pygame.time.Clock()
FPS = 60

# Objek pemain (balok)
player_width, player_height = 100, 20
player_x = WIDTH // 2 - player_width // 2
player_y = HEIGHT - player_height - 10
player_speed = 10

# Objek jatuh (bola)
ball_radius = 15
ball_x = random.randint(ball_radius, WIDTH - ball_radius)
ball_y = 0
ball_speed = 5

# Skor
score = 0
font = pygame.font.Font(None, 36)

# Loop utama
running = True
while running:
    screen.fill(WHITE)

    # Event loop
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Kontrol pemain
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] and player_x > 0:
        player_x -= player_speed
    if keys[pygame.K_RIGHT] and player_x < WIDTH - player_width:
        player_x += player_speed

    # Gerakkan bola jatuh
    ball_y += ball_speed

    # Periksa jika bola jatuh melewati layar
    if ball_y > HEIGHT:
        ball_x = random.randint(ball_radius, WIDTH - ball_radius)
        ball_y = 0
        score -= 1  # Kurangi skor jika bola terlewat

    # Periksa tabrakan antara pemain dan bola
    if (
        player_y < ball_y + ball_radius < player_y + player_height
        and player_x < ball_x < player_x + player_width
    ):
        ball_x = random.randint(ball_radius, WIDTH - ball_radius)
        ball_y = 0
        score += 1  # Tambah skor jika bola tertangkap

    # Gambar pemain
    pygame.draw.rect(screen, BLUE, (player_x, player_y, player_width, player_height))

    # Gambar bola
    pygame.draw.circle(screen, RED, (ball_x, ball_y), ball_radius)

    # Gambar skor
    score_text = font.render(f"Score: {score}", True, BLACK)
    screen.blit(score_text, (10, 10))

    # Perbarui layar
    pygame.display.flip()
    clock.tick(FPS)

# Tutup pygame
pygame.quit()
sys.exit()
