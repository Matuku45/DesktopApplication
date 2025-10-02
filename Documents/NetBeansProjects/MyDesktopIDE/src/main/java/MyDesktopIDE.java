import javax.swing.*;
import javax.swing.border.BevelBorder;
import javax.swing.text.DefaultCaret;
import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class MyDesktopIDE extends JFrame {

    private JMenuBar menuBar;
    private JMenu fileMenu, editMenu, runMenu, helpMenu, aiMenu, viewMenu;
    private JMenuItem newFile, openFile, saveFile, exitItem, runItem, clearConsole, aiPluginItem;
    private JMenuItem themeLight, themeDark, settingsItem;

    private JToolBar toolBar;
    private JButton newBtn, openBtn, saveBtn, runBtn, clearBtn;

    private JTabbedPane codeTabs;
    private HashMap<JComponent, JTextPane> codeAreas = new HashMap<>();

    private JPanel dashboardPanel;
    private JLabel breadcrumbLabel;

    private JLabel statusLabel;

    private File currentDir = new File(System.getProperty("user.dir"));

    private JTextPane consolePane;  // Console only
    private JScrollPane consoleScroll;

    public MyDesktopIDE() {
        setTitle("My IDE - Professional Coding Environment");
        setSize(1400, 900);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        setupMenuBar();
        setupToolBar();
        setupDashboard();
        setupCodeTabsAndConsole();
        setupStatusBar();

        setVisible(true);
    }

    // ===== MENU BAR =====
    private void setupMenuBar() {
        menuBar = new JMenuBar();
        fileMenu = new JMenu("File");
        editMenu = new JMenu("Edit");
        runMenu = new JMenu("Run");
        helpMenu = new JMenu("Help");
        aiMenu = new JMenu("AI Plugins");
        viewMenu = new JMenu("View");

        newFile = new JMenuItem("New");
        openFile = new JMenuItem("Open...");
        saveFile = new JMenuItem("Save");
        exitItem = new JMenuItem("Exit");
        runItem = new JMenuItem("Run");
        clearConsole = new JMenuItem("Clear Console");
        aiPluginItem = new JMenuItem("AI Plugin Marketplace");
        themeLight = new JMenuItem("Light Theme");
        themeDark = new JMenuItem("Dark Theme");
        settingsItem = new JMenuItem("Settings");

        fileMenu.add(newFile); fileMenu.add(openFile); fileMenu.add(saveFile);
        fileMenu.addSeparator(); fileMenu.add(exitItem);
        runMenu.add(runItem); runMenu.add(clearConsole);
        aiMenu.add(aiPluginItem);
        viewMenu.add(themeLight); viewMenu.add(themeDark); viewMenu.add(settingsItem);

        menuBar.add(fileMenu); menuBar.add(editMenu); menuBar.add(runMenu);
        menuBar.add(helpMenu); menuBar.add(aiMenu); menuBar.add(viewMenu);
        setJMenuBar(menuBar);

        newFile.addActionListener(e -> addNewTab());
        openFile.addActionListener(e -> openCode());
        saveFile.addActionListener(e -> saveCode());
        exitItem.addActionListener(e -> System.exit(0));
        runItem.addActionListener(e -> runCode());
        clearConsole.addActionListener(e -> consolePane.setText(""));
        aiPluginItem.addActionListener(e -> JOptionPane.showMessageDialog(this, "AI Plugin Marketplace coming soon!"));
        themeLight.addActionListener(e -> setTheme(true));
        themeDark.addActionListener(e -> setTheme(false));
        settingsItem.addActionListener(e -> openSettingsDialog());
    }

    // ===== TOOLBAR =====
    private void setupToolBar() {
        toolBar = new JToolBar();
        newBtn = new JButton("New");
        openBtn = new JButton("Open");
        saveBtn = new JButton("Save");
        runBtn = new JButton("Run");
        clearBtn = new JButton("Clear Console");

        toolBar.add(newBtn); toolBar.add(openBtn); toolBar.add(saveBtn);
        toolBar.add(runBtn); toolBar.add(clearBtn);
        add(toolBar, BorderLayout.NORTH);

        newBtn.addActionListener(e -> addNewTab());
        openBtn.addActionListener(e -> openCode());
        saveBtn.addActionListener(e -> saveCode());
        runBtn.addActionListener(e -> runCode());
        clearBtn.addActionListener(e -> consolePane.setText(""));
    }

    // ===== DASHBOARD =====
    private void setupDashboard() {
        dashboardPanel = new JPanel();
        dashboardPanel.setPreferredSize(new Dimension(250, 0));
        dashboardPanel.setBackground(new Color(40, 40, 40));
        dashboardPanel.setLayout(new BoxLayout(dashboardPanel, BoxLayout.Y_AXIS));

        breadcrumbLabel = new JLabel("Root: " + currentDir.getAbsolutePath());
        breadcrumbLabel.setForeground(Color.YELLOW);
        breadcrumbLabel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        dashboardPanel.add(breadcrumbLabel);

        updateDashboard();
        add(dashboardPanel, BorderLayout.WEST);
    }

    private void updateDashboard() {
        dashboardPanel.removeAll();
        dashboardPanel.add(breadcrumbLabel);
        breadcrumbLabel.setText("Current Dir: " + currentDir.getAbsolutePath());

        File[] files = currentDir.listFiles();
        if (files != null) {
            for (File f : files) {
                JButton fileBtn = new JButton(f.getName(),
                        f.isDirectory() ? UIManager.getIcon("FileView.directoryIcon") :
                                UIManager.getIcon("FileView.fileIcon"));
                fileBtn.setHorizontalAlignment(SwingConstants.LEFT);
                fileBtn.setMaximumSize(new Dimension(Integer.MAX_VALUE, 30));
                fileBtn.setBackground(new Color(60,60,60));
                fileBtn.setForeground(Color.WHITE);
                fileBtn.addActionListener(e -> {
                    if (f.isFile()) openFileInTab(f);
                    else if (f.isDirectory()) { currentDir = f; updateDashboard(); }
                });
                fileBtn.setComponentPopupMenu(createContextMenu(f));
                dashboardPanel.add(fileBtn);
            }
        }
        dashboardPanel.revalidate();
        dashboardPanel.repaint();
    }

    private JPopupMenu createContextMenu(File f) {
        JPopupMenu menu = new JPopupMenu();
        JMenuItem open = new JMenuItem("Open"); open.addActionListener(e -> { if(f.isFile()) openFileInTab(f); });
        JMenuItem delete = new JMenuItem("Delete"); delete.addActionListener(e -> { f.delete(); updateDashboard(); });
        JMenuItem rename = new JMenuItem("Rename"); rename.addActionListener(e -> {
            String name = JOptionPane.showInputDialog(this, "New name:", f.getName());
            if(name != null && !name.isEmpty()) { f.renameTo(new File(f.getParentFile(), name)); updateDashboard(); }
        });
        menu.add(open); menu.add(delete); menu.add(rename);
        return menu;
    }

    // ===== CODE TABS & CONSOLE =====
    private void setupCodeTabsAndConsole() {
        codeTabs = new JTabbedPane();
        addCodeTab("Main.java", "");
        codeTabs.setTabLayoutPolicy(JTabbedPane.SCROLL_TAB_LAYOUT);

        consolePane = new JTextPane();
        consolePane.setFont(new Font("Consolas", Font.PLAIN, 14));
        consolePane.setBackground(Color.BLACK);
        consolePane.setForeground(Color.GREEN);
        consolePane.setEditable(false);

        DefaultCaret caret = (DefaultCaret) consolePane.getCaret();
        caret.setUpdatePolicy(DefaultCaret.ALWAYS_UPDATE);

        consoleScroll = new JScrollPane(consolePane);

        JSplitPane splitPane = new JSplitPane(JSplitPane.VERTICAL_SPLIT, codeTabs, consoleScroll);
        splitPane.setDividerLocation(550);
        splitPane.setResizeWeight(0.7);
        add(splitPane, BorderLayout.CENTER);
    }

    // ===== FILE OPERATIONS =====
    private void openFileInTab(File f) {
        try(BufferedReader br = new BufferedReader(new FileReader(f))) {
            StringBuilder content = new StringBuilder();
            String line; while((line = br.readLine()) != null) content.append(line).append("\n");
            addCodeTab(f.getName(), content.toString());
        } catch(Exception ex) { JOptionPane.showMessageDialog(this, "Error opening file: "+ex.getMessage()); }
    }

    private void addCodeTab(String title, String content) {
        JTextPane codeArea = new JTextPane();
        codeArea.setFont(new Font("Consolas", Font.PLAIN, 16));
        codeArea.setBackground(new Color(30,30,30));
        codeArea.setForeground(Color.WHITE);
        codeArea.setCaretColor(Color.WHITE);
        codeArea.setText(content);

        JScrollPane scroll = new JScrollPane(codeArea);
        codeAreas.put(scroll, codeArea);
        codeTabs.addTab(title, scroll);

        int index = codeTabs.indexOfComponent(scroll);
        JPanel tabPanel = new JPanel(new FlowLayout(FlowLayout.LEFT,0,0));
        tabPanel.setOpaque(false);
        JLabel tabLabel = new JLabel(title);
        JButton closeBtn = new JButton("x");
        closeBtn.setFont(new Font("Arial", Font.BOLD,12));
        closeBtn.setMargin(new Insets(0,0,0,0));
        closeBtn.addActionListener(e -> { int i = codeTabs.indexOfComponent(scroll); if(i>=0) codeTabs.remove(i); });
        tabPanel.add(tabLabel); tabPanel.add(closeBtn);
        codeTabs.setTabComponentAt(index, tabPanel);
        codeTabs.setSelectedIndex(index);
    }

    private void addNewTab() { addCodeTab("File"+(codeTabs.getTabCount()+1)+".java",""); }
    private void openCode() { JFileChooser fc = new JFileChooser(); if(fc.showOpenDialog(this)==JFileChooser.APPROVE_OPTION) openFileInTab(fc.getSelectedFile()); }
    private void saveCode() {
        JScrollPane currentScroll = (JScrollPane) codeTabs.getSelectedComponent();
        JTextPane current = codeAreas.get(currentScroll);
        JFileChooser fc = new JFileChooser();
        if(fc.showSaveDialog(this)==JFileChooser.APPROVE_OPTION) {
            File file = fc.getSelectedFile();
            try(BufferedWriter bw = new BufferedWriter(new FileWriter(file))) { bw.write(current.getText()); }
            catch(Exception ex){ JOptionPane.showMessageDialog(this,"Error: "+ex.getMessage()); }
        }
    }

    private void runCode() {
        JScrollPane currentScroll = (JScrollPane) codeTabs.getSelectedComponent();
        JTextPane current = codeAreas.get(currentScroll);
        consolePane.setText("Code execution placeholder.\nYou can integrate a real compiler here.");
    }

    private void setTheme(boolean light) {
        for(JTextPane pane : codeAreas.values()) {
            if(light){ pane.setBackground(Color.WHITE); pane.setForeground(Color.BLACK); }
            else { pane.setBackground(new Color(30,30,30)); pane.setForeground(Color.WHITE); }
        }
    }

    // ===== SETTINGS PANEL =====
    private void openSettingsDialog() {
        JDialog settings = new JDialog(this, "Settings", true);
        settings.setSize(400,300);
        settings.setLocationRelativeTo(this);
        settings.setLayout(new GridLayout(4,2,10,10));

        JLabel themeLabel = new JLabel("Theme:"); 
        String[] themes = {"Light","Dark"}; 
        JComboBox<String> themeBox = new JComboBox<>(themes);

        JLabel fontLabel = new JLabel("Editor Font Size:"); 
        SpinnerNumberModel fontModel = new SpinnerNumberModel(16, 10, 36, 1);
        JSpinner fontSpinner = new JSpinner(fontModel);

        JButton applyBtn = new JButton("Apply"); 
        applyBtn.addActionListener(e -> {
            int size = (int) fontSpinner.getValue();
            for(JTextPane pane: codeAreas.values()) pane.setFont(new Font("Consolas",Font.PLAIN,size));
            settings.dispose();
        });

        settings.add(themeLabel); settings.add(themeBox);
        settings.add(fontLabel); settings.add(fontSpinner);
        settings.add(new JLabel()); settings.add(applyBtn);

        settings.setVisible(true);
    }

    private void setupStatusBar() {
        statusLabel = new JLabel("Ready");
        statusLabel.setBorder(new BevelBorder(BevelBorder.LOWERED));
        add(statusLabel, BorderLayout.SOUTH);
    }

    public static void main(String[] args){ SwingUtilities.invokeLater(MyDesktopIDE::new); }
}
