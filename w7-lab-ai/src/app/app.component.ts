import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { GeminiAiService } from './services/gemini-ai.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  selectedImage: string = ''; // URL of the selected image
  prompt: string = ''; // User-provided prompt
  output: string = ''; // Output of the AI model
  isLoading: boolean = false;

  constructor(private geminiService: GeminiAiService) {}

  async onSubmit() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      const base64Image = await this.geminiService.getImageAsBase64(this.selectedImage);
      this.output = await this.geminiService.generateRecipe(base64Image, this.prompt);
    } catch (e) {
      this.output = `Error: ${e instanceof Error ? e.message : 'Something went wrong'}`;
    }

    this.isLoading = false;
  }
}
