#include <stdio.h>

int main() {
    float armazenaMedia[5];
    float nota1, nota2;

    for (int i = 0; i < 5; i++) {
        printf("digite a primeira nota: ");
        scanf("%f", &nota1);
        printf("digite a segunda nota: ");
        scanf("%f", &nota2);

        float mediaResultado = (nota1 + nota2) / 2;
        armazenaMedia[i] = mediaResultado;
        if(armazenaMedia[i] > 0 && armazenaMedia[i] < 4.9) {
            printf("reprovado\n");
        } else {
            if(armazenaMedia[i] >= 5 && armazenaMedia[i] < 6.9) {
                printf("recuperacao\n");
            } else {
                if(armazenaMedia[i] >= 7) {
                    printf("aprovado\n");
                }
            }
        }
    }
}