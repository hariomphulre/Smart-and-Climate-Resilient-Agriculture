    # def on_created(self, event):
    #     if not event.is_directory:
    #         crops=["tea","tomato","rice"]
    #         for crop in crops:
    #             if event.src_path.lower().endswith((f'{crop}.png', f'{crop}.jpg', f'{crop}.jpeg')):
    #                 print(f"Image created: {event.src_path}")
    #                 self.trigger_action(event.src_path, crop)
