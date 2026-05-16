#[cfg(not(debug_assertions))]
use tauri::Manager;
#[cfg(not(debug_assertions))]
use tauri_plugin_shell::ShellExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      // En producción (release) lanzar el backend como sidecar.
      // En desarrollo el backend corre por separado (npm run dev:backend).
      #[cfg(not(debug_assertions))]
      {
        let app_data_dir = app.path().app_data_dir().expect("no app data dir");
        std::fs::create_dir_all(&app_data_dir).expect("cannot create app data dir");
        let db_path = app_data_dir.join("saldomint.db");

        let (_rx, _child) = app
          .shell()
          .sidecar("backend")
          .expect("backend sidecar not found")
          .env("DB_PATH", db_path.to_str().unwrap())
          .env("PORT", "8000")
          .spawn()
          .expect("failed to spawn backend sidecar");

        app.manage(std::sync::Mutex::new(_child));
      }

      #[cfg(debug_assertions)]
      app.handle().plugin(
        tauri_plugin_log::Builder::default()
          .level(log::LevelFilter::Info)
          .build(),
      )?;

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
