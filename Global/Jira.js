importPackage(Packages._soapclient);
importPackage(Packages.com.atlassian.jira.rpc.soap.beans);
importPackage(Packages.java.lang);
importPackage(Packages.java.net);

if (!global.axiom) {
    global.axiom = {};
}

axiom.Jira = function(jiraurl) {
    jiraurl = new URL(jiraurl);
    var jiraSoapServiceGetter = new JiraSoapServiceServiceLocator();
    var jiraSoapService = (jiraurl)?jiraSoapServiceGetter.getJirasoapserviceV2(jiraurl):jiraSoapServiceGetter.getJirasoapserviceV2();
    var token = null;

    this.getToken = function() { return token; };

    this.login = function(username, password) {
	token = jiraSoapService.login(username, password);
    };

    this.logout = function() {
	return jiraSoapService.logout(token);
    };

    /* Projects*/
    this.createProject = function(key, name, desc, url, lead, schemes) {
	var permissionScheme = (schemes.permissionScheme || null);
	var notificationScheme = (schemes.notificationScheme || null);
	var issueSecurityScheme = (schemes.issueSecurityScheme || null);

	return jiraSoapService.createProject(token, key, name, desc, url, lead, permissionScheme, notificationScheme, issueSecurityScheme);
    };

    this.getProject = function(idkey) {
	if (isNaN(idkey)) { return jiraSoapService.getProjectByKey(token, idkey); }
	else if (!(isNaN(idkey))) { return jiraSoapService.getProjectById(token, idkey); }

	return null;
    };

    this.getProjects = function() {
	return jiraSoapService.getProjects(token);
    };

    this.removeProject = function(key) {
	jiraSoapService.deleteProject(token, key);
    };


    /* Users */
    this.createUser = function(username, password, fullname, email) {
	return jiraSoapService.createUser(token, username, password, fullname, email);
    };

    this.getUser = function(username) {
	return jiraSoapService.getUser(token, username);
    };

    this.removeUser = function(username) {
	jiraSoapService.deleteUser(token, username);
    };


    /* Groups */
    this.createGroup = function(groupname, firstuser) {
	if (typeof firstuser == "string") { firstuser = this.getUser(firstuser); }

	jiraSoapService.createGroup(token, groupname, firstuser);
    };

    this.getGroup = function(groupname) {
	return jiraSoapService.getGroup(token, groupname);
    };

    this.removeGroup = function(groupname) {
	/* TODO: Implement */
    };

    this.addUserToGroup = function(group, user) {
	if (typeof group == "string") { group = this.getGroup(group); }
	if (typeof user == "string") { user = this.getUser(user); }

	jiraSoapService.addUserToGroup(token, group, user);
    };

    this.removeUserFromGroup = function(group, user) {
	if (typeof group == "string") { group = this.getGroup(group); }
	if (typeof user == "string") { user = this.getUser(user); }

	jiraSoapService.removeUserFromGroup(token, group, user);
    };


    /* Schemes */
    //Notification
    this.getNotificationSchemes = function() {
	return jiraSoapService.getNotificationSchemes(token);
    };

    this.getNotificationScheme = function(schemename) {
	for each (var scheme in this.getNotificationSchemes()) {
	    if (scheme.getName() == schemename) { return scheme; }
	}
	return null;
    };

    //Security
    this.getSecuritySchemes = function() {
	return jiraSoapService.getSecuritySchemes(token);
    };

    this.getSecurityScheme = function(schemename) {
	for each (var scheme in this.getSecuritySchemes()) {
	    if (scheme.getName() == schemename) { return scheme; }
	}
	return null;
    };

    //Permission
    this.getPermissionSchemes = function() {
	return jiraSoapService.getPermissionSchemes(token);
    };

    this.getPermissionScheme = function(schemename) {
	for each (var scheme in this.getPermissionSchemes()) {
	    if (scheme.getName() == schemename) { return scheme; }
	}
	return null;
    };


    /* Issues */
    this.getIssues = function(projectkeys, filtername, searchterms, size) {
	if (searchterms == null) { searchterms = ""; }

	var issues = [];

	if (filtername) {
	    issues = jiraSoapService.getIssuesFromFilter(token, filername);
	} else if(projectkeys) {
	    if (typeof projectkeys == "string") { projectkeys = [projectkeys]; }
	    issues = jiraSoapService.getIssuesFromTextSearchWithProject(token, projectkeys, searchterms, (size || 0));
	} else {
	    issues = jiraSoapService.getIssuesFromTextSearch(token, searchterms);
	}

	if (size) {
	    return issues.slice(0, size);
	}

	return issues;
    };

    return this;
}

axiom.Jira.toString = function() {
    return "[axiom.Jira]";
}

axiom.Jira.prototype.toString = function() {
    return "[axiom.Jira Object]";
}

axiom.lib = "Jira";
axiom.dontEnum(axiom.lib);
for (var i in axiom[axiom.lib])
    if (i != 'prototype')
	axiom[axiom.lib].dontEnum(i);
for (var i in axiom[axiom.lib].prototype)
    if (i != 'prototype')
	axiom[axiom.lib].prototype.dontEnum(i);
delete axiom.lib;